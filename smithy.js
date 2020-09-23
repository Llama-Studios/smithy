if(!("JSZip" in window)){
  console.error("Smithy requires JSZip, and JSZip was not found.");
};
class Smithy {
  constructor(id){
    this.id = id;
    this.components = [];
  }
  
  addComponent(c){
    this.components.push(c);
  }
  
  compile(cb){
    this._compileCallback = cb;
    this.zip = new JSZip();
    var bpuuid = Smithy.uuid();
    var rpuuid = Smithy.uuid();
    this.zip.file(this.id + "_bp/manifest.json", JSON.stringify({
     "format_version": 2,
     header: {
       name: this.title + " [BP]",
       description: this.description,
       uuid: bpuuid,
       version: this.version,
       "min_engine_version": [1, 13, 0]
     },
     modules: [
       {
         type: "data",
         uuid: Smithy.uuid(),
         version: this.version
       }
     ],
     dependencies: [
       {
         uuid: rpuuid,
         version: this.version
       }
     ],
     metadata: {
       authors: [this.author, "Generated with Smithy"],
       url: "https://llama-studios.github.io/smithy"
    }
    }));
    this.zip.file(this.id + "_rp/manifest.json", JSON.stringify({
     "format_version": 2,
     header: {
       name: this.title + " [RP]",
       description: this.description,
       uuid: rpuuid,
       version: this.version,
       "min_engine_version": [1, 13, 0]
     },
     modules: [
       {
         type: "resources",
         uuid: Smithy.uuid(),
         version: this.version
       }
     ],
     dependencies: [
       {
         uuid: bpuuid,
         version: this.version
       }
     ],
     metadata: {
       authors: [this.author, "Generated with Smithy"],
       url: "https://llama-studios.github.io/smithy"
     }
    }));
    if(this.icon){
      this.zip.file(this.id + "_bp/pack_icon.png", this.icon);
      this.zip.file(this.id + "_rp/pack_icon.png", this.icon);
    };
    for(var i = 0;i < this.components.length;i++){
      this.components[i].compile(this);
    };
    this.zip.generateAsync({type: "blob"}).then(b => {
      this._compileCallback(b);
    })
  }
  
  static uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  setMetadata(p){
    this.title = p.title || "Untitled Addon";
    this.author = p.author || "";
    this.description = p.description || "Generated with Smithy";
    this.version = p.version || [0, 0, 1];
    this.namespace = p.namespace || "smithy";
    this.icon = p.icon || null;
  }
}
class Block {
  constructor(id){
    this.id = id;
  }
  
  compile(c){
    var bpbj = {
      "format_version": "1.10.0",
      "minecraft:block": {
        "description": {
          "identifier": c.id + ":" + this.id,
          "is_experimental": false,
          "register_to_creative_menu": true
        },
        "components": {
        }
      }
    };
    c.zip.file(c.id + "_bp/blocks/" + c.id + "/" + this.id + ".json", JSON.stringify(bpbj))};
  }
}
