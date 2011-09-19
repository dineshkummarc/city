
function makeBuidPattern(x,y,z,wx,wy,h,type){
	var buildMaterial = boxMaterials[type][Math.floor(Math.random()*boxMaterials[type].length)];
	var blockposx=new Array(),blockposy=new Array(), blockposwx=new Array(),blockposwy=new Array();
	
	var nx = randInt(0,wx*0.3)*scale;
	var ny = randInt(0,wy*0.3)*scale;
	var nwx = randInt(wx*0.7,wx*0.3);
	var nwy = randInt(wy*0.7,wx*0.3);
	var nh=1+Math.floor(Math.random()*h);
	nwx = (nx/scale+nwx<wx)?nwx:((wx*scale-nx)/scale)
	nwy = (ny/scale+nwy<wy)?nwy:((wy*scale-ny)/scale)
	var niv=Math.floor((Math.sqrt(Math.sqrt(h*wx*wy))/1)*Math.random())+1;
	for(var i=0;i<niv;i++){					
		blockposwx.push(nwx+(nx/scale))
		blockposwy.push(nwy+(ny/scale))
		blockposx.push(nx/scale)
		blockposy.push(ny/scale)
		
		makeBox( nx+x , ny+y , z , nwx , nwy , nh , buildMaterial );
		nwx = -1;					
		while(check(nwx+(nx/scale),blockposwx)||check(nwy+(ny/scale),blockposwy)||check((nx/scale),blockposx)||check((ny/scale),blockposy)||nwx==-1){
			nx = randInt(0,wx*0.6)*scale;
			ny = randInt(0,wy*0.6)*scale;
			nwx = randInt(wx*0.4,wx*0.4);
			nwy = randInt(wy*0.4,wy*0.4);
			nwx = (nx/scale+nwx<wx)?nwx:((wx*scale-nx)/scale)
			nwy = (ny/scale+nwy<wy)?nwy:((wy*scale-ny)/scale)
			nh = 1+Math.floor(Math.random()*h)
			niv-=0.1
			if(niv<0)break
		}
	}
}		

function makeBox(x,y,z,wx,wy,h,materialsx){
	var tempGeometry=new THREE.CubeGeometry(wx*scale,h*scale*0.7,wy*scale,1,1,1, materialsx)
	var swx=wx/3
	var swy=wy/3
	var sh=h/3
	var rand=Math.floor(Math.random()*100);
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][0][vert].u*=swy
		tempGeometry.faceVertexUvs[0][0][vert].v*=sh	
		tempGeometry.faceVertexUvs[0][0][vert].u+=rand	
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][1][vert].u*=swy
		tempGeometry.faceVertexUvs[0][1][vert].v*=sh		
		tempGeometry.faceVertexUvs[0][1][vert].u+=rand
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][2][vert].u*=swx
		tempGeometry.faceVertexUvs[0][2][vert].v*=swy	
		tempGeometry.faceVertexUvs[0][2][vert].u+=rand	
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][3][vert].u*=swx
		tempGeometry.faceVertexUvs[0][3][vert].v*=swy
		tempGeometry.faceVertexUvs[0][3][vert].u+=rand
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][4][vert].u*=swx
		tempGeometry.faceVertexUvs[0][4][vert].v*=sh
		tempGeometry.faceVertexUvs[0][4][vert].u+=rand
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][5][vert].u*=swx
		tempGeometry.faceVertexUvs[0][5][vert].v*=sh
		tempGeometry.faceVertexUvs[0][5][vert].u+=rand
	}
	var cube = new THREE.Mesh(tempGeometry);
	cube.position.x=x+wx*scale/2;
	cube.position.z=y+wy*scale/2;
	cube.position.y=z+h*0.7*scale/2;
	THREE.GeometryUtils.merge( geo, cube );			
}

function makeBoxy(x,y,z,wx,wy,h,materialsx){
	var tempGeometry=new THREE.CylinderGeometry(4,wy*scale/2,wy*scale/2,h*scale*0.7,1,1)
	//var tempGeometry=new THREE.CubeGeometry(wx*scale,h*scale*0.7,wy*scale,1,1,1)
	var swx=wx/3
	var swy=wy/3
	var sh=h/3
	var rand=Math.floor(Math.random()*100);
	for(var i=0;i<tempGeometry.faces.length;i++){
		tempGeometry.faces[i].materials.push( materialsx[0] )
	}
	for(var i=0;i<tempGeometry.faceVertexUvs[0].length;i++){
		for(var vert=0;vert<tempGeometry.faceVertexUvs[0][i].length;vert++){
			tempGeometry.faceVertexUvs[0][i][vert].u*=swy
			tempGeometry.faceVertexUvs[0][i][vert].v*=sh
			tempGeometry.faceVertexUvs[0][i][vert].u+=rand
		}
	}
	/*
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][0][vert].u*=swy
		tempGeometry.faceVertexUvs[0][0][vert].v*=sh	
		tempGeometry.faceVertexUvs[0][0][vert].u+=rand	
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][1][vert].u*=swy
		tempGeometry.faceVertexUvs[0][1][vert].v*=sh		
		tempGeometry.faceVertexUvs[0][1][vert].u+=rand
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][2][vert].u*=swx
		tempGeometry.faceVertexUvs[0][2][vert].v*=swy	
		tempGeometry.faceVertexUvs[0][2][vert].u+=rand	
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][3][vert].u*=swx
		tempGeometry.faceVertexUvs[0][3][vert].v*=swy	
		tempGeometry.faceVertexUvs[0][3][vert].u+=rand	
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][4][vert].u*=swx
		tempGeometry.faceVertexUvs[0][4][vert].v*=sh	
		tempGeometry.faceVertexUvs[0][4][vert].u+=rand	
	}
	for(var vert=0;vert<4;vert++){
		tempGeometry.faceVertexUvs[0][5][vert].u*=swx
		tempGeometry.faceVertexUvs[0][5][vert].v*=sh	
		tempGeometry.faceVertexUvs[0][5][vert].u+=rand	
	}*/
	var cube = new THREE.Mesh(tempGeometry);
	cube.position.x=x+wx*scale/2;
	cube.position.z=y+wy*scale/2;
	cube.position.y=z+h*0.7*scale/2;
	cube.rotation.x=3.14159/2;
	THREE.GeometryUtils.merge( geo, cube );			
}

function generateMaterial(tip,prob){
	var shader = Shader[tip];
	var uniforms= THREE.UniformsUtils.clone( shader.uniforms );
	Guniforms[tip].push(uniforms)
	uniforms["val"].value =Math.random();
	uniforms["nx"].value = 3;
	uniforms["ny"].value = 3;
	uniforms["prob"].value = prob;		
	var texture_shader= new THREE.MeshShaderMaterial( {
		uniforms: uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader
	} );
	return texture_shader;
}

function createScene( geometry, scale,t, material,scena ) {
	//geometry.computeTangents();
	meshLoad= THREE.SceneUtils.addMesh( scena, geometry, scale, 0, t, 0, 0, 0, 0, material );				
	loader.statusDomElement.style.display = "none";
}	
function log( text ) {
	var e = document.getElementById("log");
	e.innerHTML = text + "<br/>" + e.innerHTML;
}	

function randInt(a,b){
	return Math.floor(a)+Math.floor(Math.random()*(b+1));
}
function rand(a,b){
	return a+Math.random()*(b);
}
function check(e,a){
	return (a.indexOf(e) != -1);
}
function initPostprocessing() {
	//config postprocessing
	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
	basicResult = new THREE.WebGLRenderTarget( window.innerWidth*1.3, window.innerHeight*0.8, pars );
	preResult = new THREE.WebGLRenderTarget( window.innerWidth*1.3, window.innerHeight*0.8, pars );
	ltResult = new THREE.WebGLRenderTarget( window.innerWidth*1.3, window.innerHeight*0.8, pars );
	
	var shader = Shader["night_d"];				
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	uniforms["tBasic"].texture = basicResult;
	uniforms["tLight"].texture = ltResult;
	uniforms["val"].value = 300.0;		
	var finaltexture = new THREE.MeshShaderMaterial( {
		uniforms: uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader
	} );
	
	//config scene
	scenep = new THREE.Scene();
	camerap = new THREE.Camera( 120, window.innerWidth / window.innerHeight, 1, 5000 );
	var plano = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth*1.3, window.innerHeight*0.8), finaltexture );
	plano.position.z =  -300;
	scenep.addObject( plano );				
}