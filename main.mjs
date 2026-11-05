import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function inspectTimecodes(manifest) {
  const { fps, segments } = manifest;
  if (!Number.isInteger(fps) || fps < 1 || fps > 60) throw new Error('fps entier requis entre 1 et 60 ; pas de drop-frame');
  if (!Array.isArray(segments)) throw new Error('segments doit être une liste');
  const issues = [];
  let previousEnd = 0;
  let totalFrames = 0;
  for (const [index, segment] of segments.entries()) {
    const start = frames(segment.start, fps);
    const end = frames(segment.end, fps);
    if (end <= start) throw new Error(`fin avant ou égale au début : segment ${index + 1}`);
    if (start < previousEnd) issues.push({ segment: index + 1, kind: 'overlap', frames: previousEnd - start });
    if (start > previousEnd) issues.push({ segment: index + 1, kind: 'gap', frames: start - previousEnd });
    previousEnd = end;
    totalFrames += end - start;
  }
  return { ok: issues.length === 0, fps, totalFrames, issues };
}

function frames(timecode, fps) {
  if (typeof timecode !== 'string' || !/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(timecode)) throw new Error('timecode attendu HH:MM:SS:FF');
  const [hours, minutes, seconds, frame] = timecode.split(':').map(Number);
  if (minutes > 59 || seconds > 59 || frame >= fps) throw new Error(`timecode hors limites : ${timecode}`);
  return ((hours * 60 + minutes) * 60 + seconds) * fps + frame;
}

async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw new Error('Usage : node main.mjs entree.json rapport.json');
  const result = inspectTimecodes(JSON.parse(await readFile(input, 'utf8')));
  await writeFile(output, JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(result.ok ? 'Continuité vérifiée.' : `${result.issues.length} anomalie(s).`);
  if (!result.ok) process.exitCode = 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(`Erreur : ${error.message}`); process.exitCode = 1; });
}
