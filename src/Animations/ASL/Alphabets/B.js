// Authentic ASL Letter B - Open hand with fingers together
export const B = (ref) => {
    let animations = [];
    
    // Open hand - fingers extended and together
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/12, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/12, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", -Math.PI/12, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", -Math.PI/12, "-"]);
    
    // Thumb extended outward
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", Math.PI/4, "+"]);
    
    // Palm facing forward
    animations.push(["mixamorigRightHand", "rotation", "z", -Math.PI/8, "-"]);
    
    // Arm extended forward
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/12, "-"]);
    
    ref.animations.push(animations);
    
    // Reset
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    
    ref.animations.push(animations);
};
