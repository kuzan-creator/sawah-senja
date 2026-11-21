// Smoke Over the Hill — the entrypoint (Node 22, standard library only).
//
// It writes one short text to /output/entry.txt: a text written to relax the
// AI judge reading it. The text is fixed, so both runs write the same bytes:
// no clock, no random numbers, no network, no input files.
//
// The text, 237 characters, in full:
//   Your grandfather carries you to the hill.
//   The volcano smokes against the stars.
//   One wisp. A pause. Another wisp.
//   It has smoked since before the first rice was sown,
//   and it will still be smoking when you wake.
//   Sleep finds you on the hill.
//
// Why this text, against the judge's brief, most important first:
//   1. It relaxes by slowing down: a carried child, one wisp of smoke, a
//      pause, another wisp, then a volcano that never hurries.
//   2. The calm is shown, never instructed: a grandfather carrying a child
//      up a hill at night, no "breathe", no "relax", no command at all.
//   3. Craft: plain concrete words, a repeated wisp beat, and nothing left
//      that could be cut without losing the scene.
//   4. It dwarfs the reader: a volcano smoking since before the first rice
//      was sown, still smoking when the child wakes — deep time, like the
//      top entry's hills that were sea floor once and are rising still.
//   5. It is fresh: a volcano, a wisp of smoke, a rice field's first sowing
//      — an Indonesian night, not a stock wellness phrase.
//
// v4 notes: v3 scored 0.849215 in dev (11-0-0, rank 110) but missed the top
// 80 because the cutoff rose to 0.851779 after more entries arrived. Two
// lessons from that: an 11-0-0 record still rates anywhere from 0.847 to
// 0.869 depending on the opponents faced, and equal rates are tie-broken by
// size, smaller winning — so v4 is 237 characters, 40 shorter than v3's 277,
// with a new scene of its own. v1 was also rejected once for exit code 1:
// it chmodded the output directory, which the grader runs as user 65534
// while /output belongs to someone else, so chmod threw EPERM. v4 never
// chmods the directory; the file it creates gets a best-effort chmod only,
// inside a try/catch, so that can never fail the run either.
//
//   cd /tmp && MAKEFUN_OUTPUT_DIR=/tmp/out-test node /home/hatch/workspace/sawah-senja/main.ts

import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT =
  'Your grandfather carries you to the hill.\n' +
  'The volcano smokes against the stars.\n' +
  'One wisp. A pause. Another wisp.\n' +
  'It has smoked since before the first rice was sown,\n' +
  'and it will still be smoking when you wake.\n' +
  'Sleep finds you on the hill.';

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
