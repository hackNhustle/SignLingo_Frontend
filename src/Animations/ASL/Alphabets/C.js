// Authentic ASL Letter C - Curved hand like holding a cup
export const C = (ref) => {
    let animations = [];
    
    // Fingers curled but not fully closed - C shape
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.5, "+"]);
    
    // Thumb bent
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    
    // Open palm facing slightly forward
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI/6, "+"]);
    
    // Hand at chest level
    animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI/8, "+"]);
    
    ref.animations.push(animations);
    
    // Reset
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "-"]);
    
    ref.animations.push(animations);
};
