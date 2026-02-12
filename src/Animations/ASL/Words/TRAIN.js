// ASL: TRAIN - Authentic sign
// Hand position: fingers rubbing together moving forward and back
export const TRAIN = (ref) => {
    let animations = [];

    // Position hands at chest
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI/12, "+"]);
    
    // Make bent fingers for rubbing motion
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/3, "+"]);
    
    ref.animations.push(animations);

    // Do the rubbing/train motion 3 times
    for (let i = 0; i < 3; i++) {
        // Move fingers forward and back (rubbing motion)
        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/8, "+"]);
        ref.animations.push(animations);

        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "y", -Math.PI/8, "-"]);
        ref.animations.push(animations);
    }

    // Reset hand
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", 0, "-"]);
    
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
