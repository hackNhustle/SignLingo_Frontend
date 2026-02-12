// Authentic ASL Letter F - Index and middle fingers curved, thumb on them
export const F = (ref) => {
    let animations = [];
    
    // Index and middle fingers curved
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/3, "+"]);
    
    // Ring and pinky closed
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    
    // Thumb touching index and middle
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI/3, "+"]);
    
    ref.animations.push(animations);
    
    // Reset
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    
    ref.animations.push(animations);
};
