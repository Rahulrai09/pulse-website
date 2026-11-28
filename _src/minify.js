// Rebuild minified site assets from the readable sources in _src/.
// Usage: node _src/minify.js   (needs: npm i terser csso)
const fs=require('fs'),path=require('path'),{minify}=require('terser'),csso=require('csso');
const root=path.join(__dirname,'..');
(async()=>{
  for(const f of fs.readdirSync(path.join(__dirname,'js'))){
    const src=fs.readFileSync(path.join(__dirname,'js',f),'utf8');
    const out=await minify(src,{compress:{passes:2},mangle:true,format:{comments:false}});
    let code=out.code;
    if(/^(header|footer)\.js$/.test(f)){ // these hold HTML templates only: drop indentation + HTML comments
      code=code.replace(/(?:\\n)+[ \t]*/g,'\\n').replace(/\\x3c!--[\s\S]*?--\\x3e/g,'');
      // minify CSS inside <style> blocks of the templates (strings are single-quoted)
      code=code.replace(/<style>([\s\S]*?)<\/style>/g,(m,css)=>{
        const raw=css.replace(/\\n/g,'\n').replace(/\\'/g,"'").replace(/\\"/g,'"');
        let mini=csso.minify(raw,{restructure:false}).css;
        mini=mini.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
        return '<style>'+mini+'</style>';
      });
    }
    fs.writeFileSync(path.join(root,'js',f),code);
    console.log('js/'+f,src.length,'->',code.length);
  }
  for(const f of fs.readdirSync(path.join(__dirname,'css'))){
    const src=fs.readFileSync(path.join(__dirname,'css',f),'utf8');
    const out=csso.minify(src).css;
    fs.writeFileSync(path.join(root,'css',f),out);
    console.log('css/'+f,src.length,'->',out.length);
  }
})();
