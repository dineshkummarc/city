var Shader = {

	/* -------------------------------------------------------------------------
	//	Depth-of-field shader with bokeh
	//	ported from GLSL shader by Martins Upitis 
	//	http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
	 ------------------------------------------------------------------------- */
	'night_d'	  : {

		uniforms: { tBasic:   { type: "t", value: 0, texture: null },
					tLight:   { type: "t", value: 0, texture: null },
					val:    { type: "f", value: 1.0 },
				  },

		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform sampler2D tBasic;",
		"uniform sampler2D tLight;",
		"uniform float val;",
		
		"void main() {",
			
			"vec4 ori = texture2D( tBasic, vUv.xy );",
			"vec4 color = ori*1.2;",
			//"color = vec4(0.5);",
			"float value=ori[1];",	
			"float dist=1.0;",	
			"float ang=0.0;",	
			"vec4 temp=vec4(0.0);",
			"vec4 rrrr=vec4(0.0);",
			"temp=(texture2D(tLight,vUv.xy+vec2(0.01*sin(ang)*dist,0.02*cos(ang)*dist)));",
			"vec4 result=vec4(0.0);",
			"for(float dist=0.0;dist<0.70;dist+=0.15){",
				"for(float ang=0.0;ang<6.28;ang+=0.4){",
					"temp=(texture2D(tLight,vUv.xy+vec2(0.01*sin(ang)*dist,0.02*cos(ang)*dist)));",
					"if(temp[0]+temp[1]+temp[2]>0.25*3.0){",
						"result+=temp*0.030;",
					"}", 
				"}", 
			"}",
			
			"gl_FragColor = vec4(color[0]+result[0],color[1]+result[1],color[2]+result[2],0.5)*1.0;",
			//"gl_FragColor = texture2D( tLight, vUv.xy );",
			"gl_FragColor.a =1.0;",	
			
		"}"
		
		].join("\n")		
	
	},
	'ceil'	  : {

		uniforms: { 					
					val:    { type: "f", value: 1.0 },
					nx:    { type: "f", value: 2.0 },
					ny:    { type: "f", value: 3.0 },
					prob:    { type: "f", value: 3.0 },
				  },
		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform float val;",
		"uniform float nx;",
		"uniform float ny;",
		"uniform float prob;",
		
		"float modulo(float a,float b){",
			"float k=((a/b)-floor(a/b))*b;",
			"if(k-floor(k)>0.5)return ceil(k);",
			"else return floor(k);",
		"}",		
		
		"float rand2(float vx,float vy){",
			"return fract(sin(dot(vec2(vx,vy) ,vec2(12.9898,78.233))) * 43758.5453*val);",
		"}",		
		"void main() {",			
			"vec4 color=vec4(0.0);",
			"float detail=10.0;",
			"float difx=(vUv.x*detail-floor(vUv.x*detail));",
			"float dify=(vUv.y*detail-floor(vUv.y*detail));",			
			
			"color+=vec4(rand2(floor(vUv.x*detail),floor(vUv.y*detail)))*(1.0-difx)*(1.0-dify) ;",
			"color+=vec4(rand2(floor(vUv.x*detail),ceil(vUv.y*detail)))*(1.0-difx)*(dify);",
			"color+=vec4(rand2(ceil(vUv.x*detail),floor(vUv.y*detail)))*(difx)*(1.0-dify) ;",
			"color+=vec4(rand2(ceil(vUv.x*detail),ceil(vUv.y*detail)))*(difx)*(dify) ;",
			"gl_FragColor = color*(val*0.01+0.03);",
			
			"gl_FragColor = color*0.025;",			
			
			"gl_FragColor.a =1.0;",		
		"}"
		
		].join("\n")
	},
	'glass'	  : {

		uniforms: { 					
					val:    { type: "f", value: 1.0 },
					nx:    { type: "f", value: 2.0 },
					ny:    { type: "f", value: 3.0 },
					prob:    { type: "f", value: 3.0 },
				  },
		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform float val;",
		"uniform float nx;",
		"uniform float ny;",
		"uniform float prob;",
		
		"float rand2(float vx,float vy){",
			"return fract(sin(dot(vec2(vx,vy) ,vec2(12.9898,78.233))) * 43758.5453*val);",
		"}",		
		"void main() {",			
			"vec4 color;",
			"float pi=3.14159;",
			"float w_x=nx;",
			"float w_y=ny;",	
			"float alpha=1.0;",
			"float colorInfuence=0.05+(rand2(val,15.0)*0.1);",	
			"if((cos(vUv.x*pi*w_x*2.0)>0.8)||(cos(vUv.y*pi*w_y*2.0)>0.8)){",
				"color=vec4((rand2(val,42.0)+1.0)*0.025+0.001);",
				"alpha=1.0;",
			"}else{",
				"alpha=1.0;",
				"color=vec4(rand2(floor(vUv.x*w_x),floor(vUv.y*w_y)))*0.4;",				
				"color+=vec4(rand2(floor(vUv.x*w_x*0.1),floor(vUv.y*w_y)))*0.6;",
				"if(color[0]<(1.0-prob)){color=(sin(color*100.0)+0.3)*(0.00+prob*0.15);}",
				"if(sin(vUv.y*pi*w_y*2.0-0.80)>0.0){",
					"float detail=8.0;",
					"float noise_r=rand2(0.5+floor(vUv.x*w_x*detail),0.5+floor(vUv.y*w_y*detail));",
					"float noise_g=noise_r+(0.5-rand2(floor(vUv.x*w_x*detail)+5.0,floor(vUv.y*w_y*detail)))*0.5;",
					"float noise_b=noise_r+(0.5-rand2(floor(vUv.x*w_x*detail)+9.0,floor(vUv.y*w_y*detail)))*0.5;",
					"vec4 result=vec4(noise_r,noise_g,noise_b,1.0)-0.2;",
					"if(result[0]+result[1]+result[2]<0.0)result=vec4(0.0);",
					"color*=1.0-(result*0.8);",
				"}",
				"color*=0.3-(floor(vUv.y*w_y)-(vUv.y*w_y));",
				"color*=1.0-(rand2(floor(vUv.x*w_x)+10.0,floor(vUv.y*w_y)+10.0)*(0.5));",
				"float cr=(rand2(val,1.0)*colorInfuence+(1.0-colorInfuence));",
				"float cg=(rand2(val,2.0)*colorInfuence+(1.0-colorInfuence));",
				"float cb=(rand2(val,3.0)*colorInfuence+(1.0-colorInfuence));",
				"color=vec4(color[0]*cr*(1.0+rand2(floor(vUv.x*w_x)+10.0,floor(vUv.y*w_y)+10.0)/4.0),color[1]*cg*(0.92+rand2(floor(vUv.x*w_x)+5.0,floor(vUv.y*w_y)+5.0)/4.0),color[2]*cb*0.85,1.0)*1.0;",
			"}",
			"gl_FragColor = vec4(color[0],color[1],color[2],1.0)*1.0;",
			"gl_FragColor.a =alpha;",		
		"}"
		
		].join("\n")
	},
	'modern'	  : {

		uniforms: { 					
					val:    { type: "f", value: 1.0 },
					nx:    { type: "f", value: 2.0 },
					ny:    { type: "f", value: 3.0 },
					prob:    { type: "f", value: 3.0 },
				  },
		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform float val;",
		"uniform float nx;",
		"uniform float ny;",
		"uniform float prob;",
		
		"float rand2(float vx,float vy){",
			"return fract(sin(dot(vec2(vx,vy) ,vec2(12.9898,78.233))) * 43758.5453*val);",
		"}",		
		"void main() {",			
			"vec4 color;",
			"float pi=3.14159;",
			"float w_x=nx;",
			"float w_y=ny;",	
			"float colorInfuence=0.15;",
			"if(cos(vUv.x*pi*w_x*2.0/3.0)>0.92){",
				"color=vec4(0.13,0.13,0.13,0.0);",
			"}else{",					
				"if(cos(vUv.y*pi*w_y*2.0)>0.0){",
					"if(cos(vUv.y*pi*w_y*2.0+pi*0.7)>0.0){",
						"color=vec4(0.045);",
					"}else{",	
						"color=vec4(0.015);",
					"}",
				"}else{",
					"if(cos(vUv.x*pi*w_x*2.0)>0.9){",
						"color=vec4(0.0);",
					"}else{",
						"color=vec4(rand2(floor(vUv.x*w_x),floor(vUv.y*w_y)))*0.4;",				
						"color+=vec4(rand2(floor(vUv.x*w_x*0.1),floor(vUv.y*w_y)))*0.6;",
						"if(color[0]<(1.0-prob)){color=(sin(color*100.0)+0.3)*(0.00+prob*0.15);}",
						"if(sin(vUv.y*pi*w_y*2.0-0.80)>0.0){",
							"float detail=8.0;",
							"float noise_r=rand2(0.5+floor(vUv.x*w_x*detail),0.5+floor(vUv.y*w_y*detail));",
							"float noise_g=noise_r+(0.5-rand2(floor(vUv.x*w_x*detail)+5.0,floor(vUv.y*w_y*detail)))*0.5;",
							"float noise_b=noise_r+(0.5-rand2(floor(vUv.x*w_x*detail)+9.0,floor(vUv.y*w_y*detail)))*0.5;",
							"vec4 result=vec4(noise_r,noise_g,noise_b,1.0)-0.3;",
							"if(result[0]+result[1]+result[2]<0.0)result=vec4(0.0);",
							"color*=1.0-(result*0.8);",
						"}",
						"color*=0.5-(floor(vUv.y*w_y)-(vUv.y*w_y));",
						"color*=1.0-(rand2(floor(vUv.x*w_x)+10.0,floor(vUv.y*w_y)+10.0)*(0.5));",
						"float cr=(rand2(val,1.0)*colorInfuence+(1.0-colorInfuence));",
						"float cg=(rand2(val,2.0)*colorInfuence+(1.0-colorInfuence));",
						"float cb=(rand2(val,3.0)*colorInfuence+(1.0-colorInfuence));",
						"color=vec4(color[0]*cr*(1.0+rand2(floor(vUv.x*w_x)+10.0,floor(vUv.y*w_y)+10.0)/4.0),color[1]*cg*(0.93+rand2(floor(vUv.x*w_x)+5.0,floor(vUv.y*w_y)+5.0)/4.0),color[2]*cb*0.85,1.0)*1.0;",
					"}",
				"}",
			"}",
			"gl_FragColor = vec4(color[0],color[1],color[2],1.0)*1.0;",
			"gl_FragColor.a =1.0;",		
		"}"
		
		].join("\n")
	},
	'brick'	  : {

		uniforms: { 					
					val:    { type: "f", value: 1.0 },
					nx:    { type: "f", value: 2.0 },
					ny:    { type: "f", value: 3.0 },
					prob:    { type: "f", value: 3.0 },
				  },
		vertexShader: [
		
		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),
		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform float val;",
		"uniform float nx;",
		"uniform float ny;",
		"uniform float prob;",		
		
		"float rand2(float vx,float vy){",
			"return fract(sin(dot(vec2(vx,vy) ,vec2(12.9898,78.233))) * 43758.5453*val);",
		"}",
		"float modulo(float a,float b){",
			"float k=((a/b)-floor(a/b))*b;",
			"if(k-floor(k)>0.5)return ceil(k);",
			"else return floor(k);",
		"}",				
		
		"void main() {",			
			"vec4 color=vec4(0.0);",
			"float pi=3.14159;",
			"float k=0.50;",
			"float w_x=nx;",
			"float w_y=ny;",	
			"vec4 cBrick=vec4(0.15*(rand2(val,1.0)*0.5+0.5),0.05*(rand2(val,2.0)*0.5+0.5),0.01*(rand2(val,3.0)*0.5+0.5),1.0);",
			"cBrick*=0.35;",
			"if((cos(vUv.x*pi*w_x*2.0)>k)||(cos(vUv.y*pi*w_y*2.0)>k)){",
				// wall //
				"if(cos(vUv.y*pi*w_y*8.0*2.0)>0.8){",
					"color=vec4(0.0);",					
				"}else{",					
					"if( modulo(floor(vUv.y*8.0*w_y),2.0)==0.0 ){",
						"if(cos(vUv.x*pi*w_x*4.0*2.0)>0.8){",
							"color=vec4(0.0);",				
						"}else{",							
							"color=cBrick;",	
						"}",
					"}else{",
						"if(cos(vUv.x*pi*w_x*4.0*2.0+pi)>0.8){",
							"color=vec4(0.0);",				
						"}else{",
							"color=cBrick;",
						"}",
					"}",
				"}",
				// wall //
			"}else{",
				// window_full //
				"if((cos(vUv.x*pi*w_x*2.0)>(k-0.3))||(cos(vUv.y*pi*w_y*2.0)>(k-0.3))){",
					"color=cBrick*0.0;",
				"}else{",
					"if((cos(vUv.x*pi*w_x*2.0)>(k-0.6))||(cos(vUv.y*pi*w_y*2.0)>(k-0.6))){",
						"color=cBrick*1.1;",
					"}else{",
						// window_glass //
						"color=vec4(rand2(floor(vUv.x*w_x),floor(vUv.y*w_y)))*0.5;",				
						"color+=vec4(rand2(floor(vUv.x*w_x*0.1),floor(vUv.y*w_y)))*0.5;",
						"if(color[0]<(1.0-prob)){color=(sin(color*100.0)+0.3)*(0.00+prob*0.15);}",
						"if(sin(vUv.y*pi*w_y*2.0-0.80)>0.0){",
							"float detail=8.0;",
							"float noise_r=rand2(0.5+floor(vUv.x*w_x*detail),0.5+floor(vUv.y*w_y*detail));",
							"float noise_g=noise_r+(0.5-rand2(floor(vUv.x*w_x*detail)+5.0,floor(vUv.y*w_y*detail)))*0.5;",
							"float noise_b=noise_r+(0.5-rand2(floor(vUv.x*w_x*detail)+9.0,floor(vUv.y*w_y*detail)))*0.5;",
							"vec4 result=vec4(noise_r,noise_g,noise_b,1.0)-0.3;",
							"if(result[0]+result[1]+result[2]<0.0)result=vec4(0.0);",
							"color*=1.0-(result*0.8);",
						"}",
						"color*=0.5-(floor(vUv.y*w_y)-(vUv.y*w_y));",
						"color*=1.0-(rand2(floor(vUv.x*w_x)+10.0,floor(vUv.y*w_y)+10.0)*(0.5));",	
						"color=vec4(color[0]*cr*1.0,color[1]*cg*0.9,color[2]*cb*0.8,1.0)*1.0;",						
						// window_glass //
					"}",
				"}",
				// window_full //
			"}",
			
			"gl_FragColor = color;",			
			
			"gl_FragColor.a =1.0;",		
		"}"
		
		].join("\n")
	}

};
		