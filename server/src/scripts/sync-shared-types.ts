import { promises as fs } from "node:fs";
import path from "node:path";

const SHARED_TYPES_ROOT = path.resolve(__dirname, "../../../shared/types");
const OUTPUT_FILE = path.resolve(__dirname, "../types/shared.types.ts");
const GENERATED_START = "// AUTO-GENERATED SHARED EXPORTS START";
const GENERATED_END = "// AUTO-GENERATED SHARED EXPORTS END";

const toPosixPath = (filePath: string) => filePath.split(path.sep).join("/");

const toModulePath = (filePath: string) => {
  const normalizedPath = toPosixPath(filePath);

  return normalizedPath.startsWith(".")
    ? normalizedPath
    : `./${normalizedPath}`;
};

const collectTypeFiles = async (directory: string): Promise<string[]> => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectTypeFiles(entryPath);
      }

      if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".d.ts")
      ) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat();
};

const rewriteTypeImports = (
  fileContent: string,
  sourceFilePath: string,
): string =>
  fileContent.replace(
    /^import\s+type\s+(.+?)\s+from\s+["'](.+?)["'];?$/gm,
    (_match, importClause: string, importPath: string) => {
      const resolvedImportPath = path.resolve(
        path.dirname(sourceFilePath),
        importPath,
      );
      const relativeImportPath = path.relative(
        path.dirname(OUTPUT_FILE),
        resolvedImportPath,
      );

      return `import type ${importClause} from "${toModulePath(relativeImportPath)}";`;
    },
  );

const buildGeneratedBlock = async (sharedFiles: string[]): Promise<string> => {
  const fileBlocks = await Promise.all(
    sharedFiles
      .sort((left, right) => left.localeCompare(right))
      .map(async (filePath) => {
        const sourceContent = await fs.readFile(filePath, "utf8");
        const relativeSourcePath = path.relative(
          path.dirname(OUTPUT_FILE),
          filePath,
        );
        const normalizedContent = rewriteTypeImports(
          sourceContent.trim(),
          filePath,
        );

        return [
          `// Copied from ${toPosixPath(relativeSourcePath)}`,
          normalizedContent,
        ].join("\n");
      }),
  );

  return [GENERATED_START, ...fileBlocks, GENERATED_END].join("\n");
};

const syncSharedTypes = async (): Promise<void> => {
  const [sharedFiles, currentOutput] = await Promise.all([
    collectTypeFiles(SHARED_TYPES_ROOT),
    fs.readFile(OUTPUT_FILE, "utf8"),
  ]);

  const generatedBlock = await buildGeneratedBlock(sharedFiles);
  const blockPattern = new RegExp(
    `${GENERATED_START}[\\s\\S]*${GENERATED_END}`,
    "m",
  );

  if (!blockPattern.test(currentOutput)) {
    throw new Error(
      "Could not find the shared export markers in shared.types.ts",
    );
  }

  const nextOutput = currentOutput.replace(blockPattern, generatedBlock);

  if (nextOutput !== currentOutput) {
    await fs.writeFile(OUTPUT_FILE, `${nextOutput.trimEnd()}\n`, "utf8");
  }
};

syncSharedTypes().catch((error) => {
  console.error("Failed to sync shared types:", error);
  process.exitCode = 1;
});
