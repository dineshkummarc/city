
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var statsEnabled = true;

//others
var container, stats, loader;
var textureGlass,shader;
var Guniforms=new Array();

//configs
var scale=50;
var www=25;
var hhh=20;
var qw=24;
var qh=36;
var roads=8;

//basics
var camera_esp, camerap; 
var renderer;
var scenep,scenet;

//objects			
var meshLoad;
var geo;
var materials;
var boxMaterials=new Array();

//lights
var directionalLight, pointLight, ambientLight;

//config

//posprocessing
var basicResult,preResult,ltResult;

init();
animate();

function init() {			
	container = document.getElementById('cont');
	document.body.appendChild(container);
	
	//CAmera configs
	camera_esp = new THREE.QuakeCamera( {
		fov: 60, aspect: window.innerWidth*1.3 / window.innerHeight, near: 1, far: 300000,
		movementSpeed:500, lookSpeed: 0.1, noFly: false, lookVertical: true
	} );				
	camera_esp.position.y=2000;
	camera_esp.position.x=www/2*(qw+roads)*scale;
	camera_esp.position.z=hhh/2*(qh+roads)*scale
	//scene configs
	scenet = new THREE.Scene();

	// LIGHTS
	ambientLight = new THREE.AmbientLight( 0x111111 );
	//scene.addLight( ambientLight );
	pointLight = new THREE.PointLight( 0x6688AA,1.0 );
	pointLight.position.z = 0;pointLight.position.x = 0;pointLight.position.y = 500;
	scenet.addLight( pointLight );
	var pointLightz = new THREE.PointLight( 0xffAA33,1.0 );
	pointLightz.position.z = 5000;pointLightz.position.x = 15000;pointLightz.position.y = 2500;			
	scenet.addLight( pointLightz );
	
	//loader
	loader = new THREE.JSONLoader( true );
	document.body.appendChild( loader.statusDomElement );
	
	/********************************= Start Main =************************************/
	//textures/materials aux
	var t1 = THREE.ImageUtils.loadTexture( "v.jpg"  );t1.wrapS = THREE.RepeatWrapping;t1.wrapT = THREE.RepeatWrapping;				
	var skytext = THREE.ImageUtils.loadTexture( "v.jpg"  );
	var groundtext = THREE.ImageUtils.loadTexture( "v.jpg"  );groundtext.wrapS = THREE.RepeatWrapping;groundtext.wrapT = THREE.RepeatWrapping;
	
	var materialAux = new THREE.MeshBasicMaterial( { color: 0xFFEEBB , ambient:0xFFEEBB , map:t1 , shading:THREE.FlatShading } );	
	
	//shader-materials
	//mat	
	var tGlass=new Array();
	var tModern=new Array();
	var tBrick=new Array();	
	Guniforms["glass"]=new Array();
	Guniforms["modern"]=new Array();
	Guniforms["brick"]=new Array();
	Guniforms["ceil"]=new Array();
	
	var textureTipe= "glass"
	tGlass[0]=generateMaterial(textureTipe,0.20);
	tGlass[1]=generateMaterial(textureTipe,0.30);
	tGlass[2]=generateMaterial(textureTipe,0.34);
	tGlass[3]=generateMaterial(textureTipe,0.38);
	tGlass[4]=generateMaterial(textureTipe,0.42);
	/*tGlass[5]=generateMaterial(textureTipe,0.34);
	tGlass[6]=generateMaterial(textureTipe,0.36);
	tGlass[7]=generateMaterial(textureTipe,0.38);
	tGlass[8]=generateMaterial(textureTipe,0.41);
	tGlass[9]=generateMaterial(textureTipe,0.45);*/
	var textureTipe= "modern"				
	tModern[0]=generateMaterial(textureTipe,0.20);
	tModern[1]=generateMaterial(textureTipe,0.30);
	tModern[2]=generateMaterial(textureTipe,0.40);
	var textureTipe= "brick"				
	tBrick[0]=generateMaterial(textureTipe,0.20);
	tBrick[1]=generateMaterial(textureTipe,0.30);
	tBrick[2]=generateMaterial(textureTipe,0.40);
	
	tCeil=generateMaterial("ceil",0.40);
	
	boxMaterials["glass"]=new Array();
	for(var i=0;i<tGlass.length;i++){
		boxMaterials["glass"].push( [tGlass[i],tGlass[i],tCeil,tGlass[i],tGlass[i],tGlass[i]] ) 
	}
	boxMaterials["modern"]=new Array();
	for(var i=0;i<tModern.length;i++){
		boxMaterials["modern"].push( [tModern[i],tModern[i],tCeil,tModern[i],tModern[i],tModern[i]] ) 
	}
	boxMaterials["brick"]=new Array();
	for(var i=0;i<tBrick.length;i++){
		boxMaterials["brick"].push( [tBrick[i],tBrick[i],tCeil,tBrick[i],tBrick[i],tBrick[i]] ) 
	}
	geo = new THREE.Geometry();
	for(var x=0;x<www;x++){
		for(var y=0;y<hhh;y++){
			var basex=(((www/2)*(www/2))-((www/2-x)*(www/2-x)))/((www/2)*(www/2));
			var basey=(((hhh/2)*(hhh/2))-((hhh/2-y)*(hhh/2-y)))/((hhh/2)*(hhh/2));
			var base=(basex*basey*12)+0;
			if(base>5){			
				if(base<8){
					var divx=3
					var divy=4
				}else if(base<10){
					var divx=2
					var divy=3
				}else if(base<15){
					var divx=2
					var divy=2
				}
				for(var xx=0;xx<divx;xx++){
					for(var yy=0;yy<divy;yy++){
						makeBuilding( (xx*qw/divx+x*(qw+roads))*scale, (yy*qh/divy+y*(qh+roads))*scale,0,(qw/divx),(qh/divy),1+Math.floor(Math.random()*base+Math.random()*Math.pow(base,4)*0.005));
					}
				}
			}
		}
	}
	
	var cityMesh = new THREE.Mesh( geo , new THREE.MeshFaceMaterial() );
	scenet.addObject( cityMesh );					
	/*********************************= End Main =*************************************/
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );				
	scenet.matrixAutoUpdate = false;
	
	initPostprocessing();
	if(statsEnabled){stats = new Stats();stats.domElement.style.position = 'absolute';stats.domElement.style.top = '0px';stats.domElement.style.zIndex = 100;container.appendChild( stats.domElement );}
}

function makeBuilding(x,y,z,wx,wy,h){
	if(h<20){
		if(Math.random()<0.65)
			makeB_Block_classic(x,y,z,wx,wy,h)
		else if(Math.random()<0.5)
			makeB_Block_modern(x,y,z,wx,wy,h)
		else
			makeB_Block_modern_glass(x,y,z,wx,wy,h)
	}else if(h<40){
		if(Math.random()<0.30)
			makeB_Block_classic(x,y,z,wx,wy,h)
		else if(Math.random()<0.6)
			makeB_Block_modern(x,y,z,wx,wy,h)
		else
			makeB_Block_modern_glass(x,y,z,wx,wy,h)
	}else if(h<60){
		if(Math.random()<0.70)
			makeB_Block_modern(x,y,z,wx,wy,h)
		else
			makeB_Block_modern_glass(x,y,z,wx,wy,h)	
	}else if(h<80){
		if(Math.random()<0.6)
			makeB_Block_modern(x,y,z,wx,wy,h)
		else
			makeB_Block_modern_glass(x,y,z,wx,wy,h)	
	}else{
		makeB_Block_modern_glass(x,y,z,wx,wy,h)
	}
}

function makeB_Block_classic(x,y,z,wx,wy,h){
	makeBuidPattern(x,y,z,wx,wy,h,"brick")
}

function makeB_Block_modern(x,y,z,wx,wy,h){	
	makeBuidPattern(x,y,z,wx,wy,h,"modern")
}

function makeB_Block_modern_glass(x,y,z,wx,wy,h){	
	makeBuidPattern(x,y,z,wx,wy,h,"glass")
}

function animate() {
	requestAnimationFrame( animate );
		
	//lala["val"].value =Math.random();
	/*for(var i=0;i<Guniforms["glass"].length;i++){
		Guniforms["glass"][i]["val"].value =Math.random();
	}
	for(var i=0;i<Guniforms["modern"].length;i++){
		Guniforms["modern"][i]["val"].value =Math.random();
	}
	for(var i=0;i<Guniforms["brick"].length;i++){
		Guniforms["brick"][i]["val"].value =Math.random();
	}*/
	render();
	if ( statsEnabled ) stats.update();
}

function render() {			
	renderer.render( scenet, camera_esp, basicResult, false );
	renderer.render( scenet, camera_esp, ltResult, false );
	//renderer.render( scenet, camera_esp);				
	renderer.render( scenep, camerap);
}
