var script = document.createElement('script');
script.src = "app.manifest.json";
script.type = "application/json";
document.getElementsByTagName('head')[0].appendChild(script);

console.log(document.getElementsByTagName('head'));