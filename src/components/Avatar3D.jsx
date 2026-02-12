import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ybot from '../Models/ybot/ybot.glb';
import * as words from '../Animations/words';
import * as alphabets from '../Animations/alphabets';
import * as numbers from '../Animations/numbers';
import { defaultPose } from '../Animations/defaultPose';
import * as aslWords from '../Animations/ASL/Words/index.js';
import * as aslAlphabets from '../Animations/ASL/Alphabets/index.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const Avatar3D = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const componentRef = useRef({});
  const { current: avatarRef } = componentRef;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const initialMount = useRef(true);

  useImperativeHandle(ref, () => ({
    performSign: (text, onComplete) => {
      if (!text) return;

      // Reset state and clear any pending animations
      avatarRef.animations = [];
      avatarRef.pending = false;
      avatarRef.flag = false;
      
      // Reset to default pose before each sign
      if (avatarRef.avatar) {
        const neck = avatarRef.avatar.getObjectByName("mixamorigNeck");
        const leftArm = avatarRef.avatar.getObjectByName("mixamorigLeftArm");
        const leftForeArm = avatarRef.avatar.getObjectByName("mixamorigLeftForeArm");
        const rightArm = avatarRef.avatar.getObjectByName("mixamorigRightArm");
        const rightForeArm = avatarRef.avatar.getObjectByName("mixamorigRightForeArm");
        
        if (neck) neck.rotation.x = Math.PI/12;
        if (leftArm) leftArm.rotation.z = -Math.PI/3;
        if (leftForeArm) leftForeArm.rotation.y = -Math.PI/1.5;
        if (rightArm) rightArm.rotation.z = Math.PI/3;
        if (rightForeArm) rightForeArm.rotation.y = Math.PI/1.5;
        
        // Reset all finger bones to neutral position
        const fingerBones = [
          'LeftHandThumb1', 'LeftHandThumb2', 'LeftHandThumb3', 'LeftHandThumb4',
          'LeftHandIndex1', 'LeftHandIndex2', 'LeftHandIndex3', 'LeftHandIndex4',
          'LeftHandMiddle1', 'LeftHandMiddle2', 'LeftHandMiddle3', 'LeftHandMiddle4',
          'LeftHandRing1', 'LeftHandRing2', 'LeftHandRing3', 'LeftHandRing4',
          'LeftHandPinky1', 'LeftHandPinky2', 'LeftHandPinky3', 'LeftHandPinky4',
          'RightHandThumb1', 'RightHandThumb2', 'RightHandThumb3', 'RightHandThumb4',
          'RightHandIndex1', 'RightHandIndex2', 'RightHandIndex3', 'RightHandIndex4',
          'RightHandMiddle1', 'RightHandMiddle2', 'RightHandMiddle3', 'RightHandMiddle4',
          'RightHandRing1', 'RightHandRing2', 'RightHandRing3', 'RightHandRing4',
          'RightHandPinky1', 'RightHandPinky2', 'RightHandPinky3', 'RightHandPinky4'
        ];
        
        fingerBones.forEach(boneName => {
          const bone = avatarRef.avatar.getObjectByName('mixamorig' + boneName);
          if (bone) {
            bone.rotation.set(0, 0, 0);
          }
        });
      }
      
      const str = text.toUpperCase();
      const strWords = str.split(' ');

      // Select animation library based on language
      const selectedWords = language === 'ASL' ? aslWords : words;
      const selectedAlphabets = language === 'ASL' ? aslAlphabets : alphabets;

      for (let word of strWords) {
        if (numbers[word]) {
          avatarRef.animations.push(['add-text', word + ' ']);
          numbers[word](avatarRef);
        } else if (selectedWords[word]) {
          avatarRef.animations.push(['add-text', word + ' ']);
          selectedWords[word](avatarRef);
        } else {
          for (const ch of word.split('')) {
            avatarRef.animations.push(['add-text', ch]);
            if (selectedAlphabets[ch]) {
              selectedAlphabets[ch](avatarRef);
            }
          }
        }
      }

      avatarRef.onComplete = onComplete;

      if (avatarRef.pending === false) {
        avatarRef.pending = true;
        avatarRef.animate();
      }
    }
  }));

  useEffect(() => {
    if (!containerRef.current) {
      // console.log('Container ref not ready');
      return;
    }

    // console.log('Initializing Avatar3D...');
    // console.log('Container dimensions:', containerRef.current.clientWidth, containerRef.current.clientHeight);

    avatarRef.flag = false;
    avatarRef.pending = false;
    avatarRef.animations = [];
    avatarRef.characters = [];
    avatarRef.speed = 0.1;
    avatarRef.pause = 800;

    avatarRef.scene = new THREE.Scene();
    // Remove background color to make it transparent
    avatarRef.scene.background = null;

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    avatarRef.scene.add(spotLight);

    avatarRef.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    avatarRef.renderer.setClearColor(0x000000, 0); // Transparent background
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    // console.log('Setting up renderer with dimensions:', width, height);

    avatarRef.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    avatarRef.renderer.setSize(width, height);

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(avatarRef.renderer.domElement);
    // console.log('Renderer added to DOM');

    // Adjust camera to show full avatar with hands visible
    avatarRef.camera.position.z = 2.2;
    avatarRef.camera.position.y = 1.4;
    avatarRef.camera.lookAt(0, 1.2, 0);

    // console.log('Loading model from:', ybot);

    const loader = new GLTFLoader();
    loader.load(
      ybot,
      (gltf) => {
        // console.log('Avatar loaded successfully');
        gltf.scene.traverse((child) => {
          if (child.type === 'SkinnedMesh') {
            child.frustumCulled = false;
          }
        });
        avatarRef.avatar = gltf.scene;
        avatarRef.avatar.position.set(0, -0.15, 0);
        avatarRef.avatar.visible = false;
        avatarRef.scene.add(avatarRef.avatar);
        
        // Set default pose directly for instant loading
        const neck = avatarRef.avatar.getObjectByName("mixamorigNeck");
        const leftArm = avatarRef.avatar.getObjectByName("mixamorigLeftArm");
        const leftForeArm = avatarRef.avatar.getObjectByName("mixamorigLeftForeArm");
        const rightArm = avatarRef.avatar.getObjectByName("mixamorigRightArm");
        const rightForeArm = avatarRef.avatar.getObjectByName("mixamorigRightForeArm");
        
        if (neck) neck.rotation.x = Math.PI/12;
        if (leftArm) leftArm.rotation.z = -Math.PI/3;
        if (leftForeArm) leftForeArm.rotation.y = -Math.PI/1.5;
        if (rightArm) rightArm.rotation.z = Math.PI/3;
        if (rightForeArm) rightForeArm.rotation.y = Math.PI/1.5;
        
        // Wait one frame for rotations to apply, then show
        requestAnimationFrame(() => {
          avatarRef.avatar.visible = true;
          setLoading(false);
        });
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading avatar:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    avatarRef.animate = () => {
      if (avatarRef.animations.length === 0) {
        avatarRef.pending = false;
        return;
      }
      if (!avatarRef.avatar) {
        requestAnimationFrame(avatarRef.animate);
        return;
      }
      requestAnimationFrame(avatarRef.animate);
      
      if (avatarRef.animations[0].length) {
        if (!avatarRef.flag) {
          if (avatarRef.animations[0][0] === 'add-text') {
            avatarRef.animations.shift();
          } else {
            for (let i = 0; i < avatarRef.animations[0].length; ) {
              let [boneName, action, axis, limit, sign] = avatarRef.animations[0][i];
              const bone = avatarRef.avatar.getObjectByName(boneName);
              if (!bone || !bone[action]) {
                avatarRef.animations[0].splice(i, 1);
                continue;
              }
              if (sign === '+' && bone[action][axis] < limit) {
                bone[action][axis] += avatarRef.speed;
                bone[action][axis] = Math.min(bone[action][axis], limit);
                i++;
              } else if (sign === '-' && bone[action][axis] > limit) {
                bone[action][axis] -= avatarRef.speed;
                bone[action][axis] = Math.max(bone[action][axis], limit);
                i++;
              } else {
                avatarRef.animations[0].splice(i, 1);
              }
            }
          }
        }
      } else {
        avatarRef.flag = true;
        setTimeout(() => {
          avatarRef.flag = false;
        }, avatarRef.pause);
        avatarRef.animations.shift();
      }
      avatarRef.renderer.render(avatarRef.scene, avatarRef.camera);
    };

    const renderLoop = () => {
      if (avatarRef.renderer && avatarRef.scene && avatarRef.camera) {
        avatarRef.renderer.render(avatarRef.scene, avatarRef.camera);
      }
      requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      if (containerRef.current && avatarRef.renderer && avatarRef.renderer.domElement) {
        try {
          containerRef.current.removeChild(avatarRef.renderer.domElement);
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, [avatarRef]);

  useEffect(() => {
    if (!avatarRef.avatar) return;
    
    // Skip on initial mount, only run when language actually changes
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    
    // Clear pending animations and reset pose on language switch
    avatarRef.animations = [];
    avatarRef.pending = false;
    avatarRef.flag = false;
    
    // Set default pose directly without animation
    const neck = avatarRef.avatar.getObjectByName("mixamorigNeck");
    const leftArm = avatarRef.avatar.getObjectByName("mixamorigLeftArm");
    const leftForeArm = avatarRef.avatar.getObjectByName("mixamorigLeftForeArm");
    const rightArm = avatarRef.avatar.getObjectByName("mixamorigRightArm");
    const rightForeArm = avatarRef.avatar.getObjectByName("mixamorigRightForeArm");
    
    if (neck) neck.rotation.x = Math.PI/12;
    if (leftArm) leftArm.rotation.z = -Math.PI/3;
    if (leftForeArm) leftForeArm.rotation.y = -Math.PI/1.5;
    if (rightArm) rightArm.rotation.z = Math.PI/3;
    if (rightForeArm) rightForeArm.rotation.y = Math.PI/1.5;
  }, [language]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-600">Loading avatar...</div>
        </div>
      )}
    </div>
  );
});

Avatar3D.displayName = 'Avatar3D';

export default Avatar3D;
