/** Prepare the supplied archives directly from originals. No web dependencies.
 * node tools/prepare-hors-cadre.mjs /absolute/path/to/PROJECT\ CAMILO2
 * Requires ImageMagick with HEIC support, cwebp and FFmpeg in PATH.
 */
import {readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync, mkdtempSync, unlinkSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] || '../PROJECT CAMILO2');
const selection = JSON.parse(readFileSync(join(root, 'journal/hors-cadre/selection.json')));
const folder = join(root, 'images/hors-cadre');
const temporary = mkdtempSync(join(tmpdir(), 'camilo-encode-'));
const intermediate = join(temporary, 'source.png');
mkdirSync(folder, {recursive:true});
const all = [];
for (const item of selection) {
  const input = join(source, item.source);
  const prefix = `images/hors-cadre/${item.id}`;
  const cropped = item.crop ? ['-crop', item.crop, '+repage'] : [];
  const base = [`${input}[0]`, '-auto-orient', ...cropped, '-colorspace', 'sRGB', '-strip'];
  // A lossless PNG avoids a second lossy generation. A file also avoids stdin
  // backpressure in platform builds of cwebp. Each subprocess has a time limit.
  const encode = (file, width) => {
    if (existsSync(join(root,file))) return;
    execFileSync('magick', [...base, '-resize', `${width}x1800>`, '-depth', '8', intermediate], {timeout:60000});
    execFileSync('cwebp', ['-quiet','-q','80','-m','6','-metadata','none','-o',join(root,file),intermediate], {timeout:60000});
  };
  encode(`${prefix}.webp`, 1600);
  const [width,height] = execFileSync('magick',['identify','-format','%w %h',join(root,`${prefix}.webp`)],{encoding:'utf8'}).split(' ').map(Number);
  const variants=[];
  for (const size of [480,900].filter(w=>w<width)) {
    const file=`${prefix}-${size}.webp`;
    encode(file,size);
    variants.push({file,width:size});
  }
  all.push({...item,file:`${prefix}.webp`,width,height,variants,bytes:statSync(join(root,`${prefix}.webp`)).size});
  console.log(`${item.id} ${width}×${height}`);
}
writeFileSync(join(root,'journal/hors-cadre/media.json'),JSON.stringify(all,null,2)+'\n');
const videos = readdirSync(source).filter(f=>/\.mp4$/i.test(f)).sort();
for (const [i,input] of videos.entries()) {
  const slug=i===0?'encre-bleue':'encre-noire';
  for (const mobile of [true,false]) {
    const file=join(root,`videos/${slug}-${mobile?'mobile':'desktop'}.mp4`);
    if (existsSync(file) && !process.argv.includes('--reencode-video')) continue;
    const crop=i===0?(mobile?'360:600:50:65':'530:332:50:70'):(mobile?'360:600:235:380':'530:332:155:610');
    const size=mobile?'432:720':'960:600';
    const filter=`crop=${crop},lenscorrection=k1=-0.19:k2=0.06,scale=${size}:flags=lanczos,setsar=1,fps=24`;
    execFileSync('ffmpeg',['-v','error','-y','-i',join(source,input),'-map','0:v:0','-an','-sn','-dn','-map_metadata','-1','-vf',filter,'-c:v','libx264','-preset','slow','-crf','29','-pix_fmt','yuv420p','-movflags','+faststart',file],{stdio:'inherit',timeout:120000});
    console.log(`${slug} ${mobile?'mobile':'desktop'}: ${statSync(file).size} octets`);
  }
  for (const mobile of [true,false]) {
    const target=join(folder,`${slug}-${mobile?'mobile':'desktop'}-poster.webp`);
    if (existsSync(target) && !process.argv.includes('--reencode-video')) continue;
    execFileSync('ffmpeg',['-v','error','-y','-ss',i===0?'2':'9','-i',join(root,`videos/${slug}-${mobile?'mobile':'desktop'}.mp4`),'-frames:v','1',intermediate],{stdio:'inherit',timeout:60000});
    execFileSync('cwebp',['-quiet','-q','82','-m','6','-metadata','none',intermediate,'-o',target],{timeout:60000});
  }
}
console.log(`Prepared ${all.length} archives and ${videos.length} silent macro films.`);
if (existsSync(intermediate)) unlinkSync(intermediate);
rmdirSync(temporary);
