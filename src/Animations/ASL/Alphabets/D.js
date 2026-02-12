// Authentic ASL Letter D - Index finger up, others closed
export const D = (ref) => {
    let animations = [];
    
    // Index extended straight up
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    
    // Other fingers closed
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    
    // Thumb closed
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    
    // Hand position
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/15, "-"]);
    
    ref.animations.push(animations);
    
    // Reset
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    
    ref.animations.push(animations);
};
