// Authentic ASL Letter E - All fingers slightly bent inward, thumb tucked
export const E = (ref) => {
    let animations = [];
    
    // Fingers curled
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.5, "+"]);
    
    // Thumb tucked in
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/2.2, "+"]);
    
    // Hand at mouth level
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/4, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI/6, "+"]);
    
    ref.animations.push(animations);
    
    // Reset
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "-"]);
    
    ref.animations.push(animations);
};
