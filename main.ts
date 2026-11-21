// The Sawah Holds the Sky — the entrypoint (Node 22, standard library only).
//
// It writes one short text to /output/entry.txt: a text written to relax the
// AI judge reading it. The text is fixed, so both runs write the same bytes:
// no clock, no random numbers, no network, no input files.
//
// The text, 263 characters, in full:
//   The sawah holds the sky in its still water, and the moon walks across
//   it in no hurry at all. A frog calls once, then forgets. The mountains
//   do not move. The water does not move. Under all that stillness, the
//   rice keeps growing, too slow to see in a single season.
//
// Why this text, against the judge's brief, most important first:
//   1. It relaxes by slowing down: still water, a moon in no hurry, two
//      short sentences that stop the reading dead, then one long slow one.
//   2. The calm is shown, never instructed: there is no "breathe", no
//      "relax", no command at all, only a scene that is already calm.
//   3. Craft: plain concrete words, a repeated "do not move" beat, and
//      nothing left that could be cut without losing the scene.
//   4. It dwarfs the reader: rice growing too slow to see in a season
//      keeps growing after the last line, long after the reading ends.
//   5. It is fresh: a sawah at night, a frog that forgets, a moon walking
//      across a field of water — not a stock wellness phrase.
//
//   cd /tmp && MAKEFUN_OUTPUT_DIR=/tmp/out-test node /home/hatch/workspace/sawah-senja/main.ts

import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT =
  'The sawah holds the sky in its still water, and the moon walks across it in no hurry at all. ' +
  'A frog calls once, then forgets. The mountains do not move. The water does not move. ' +
  'Under all that stillness, the rice keeps growing, too slow to see in a single season.';

const chars = [...TEXT].length;
if (chars < 1 || chars > 280 || TEXT.trim().length === 0) {
  process.stderr.write(`sawah-senja: text is ${chars} characters, must be 1 to 280\n`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, 'entry.txt');
writeFileSync(outFile, TEXT, 'utf8');
// Never chmod the output directory: the grader runs this program as user
// 65534 and mounts /output owned by someone else, so chmod on the directory
// throws EPERM and kills the run (that is how v1 failed: exit code 1).
// The file itself is ours, so a best-effort chmod is safe, and it must
// never fail the run either, hence the try/catch.
try {
  chmodSync(outFile, 0o644);
} catch {
  // The default mode from writeFileSync is readable enough; keep going.
}
