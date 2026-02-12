// ASL: THANK YOU - Open hand touches lips/chin, then moves forward and down
export const THANKYOU = (ref) => {
    let animations = [];

    // Open hand - all fingers extended
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky3", "rotation", "z", 0, "-"]);
    
    // Raise hand to face level with palm facing slightly inward
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/2, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/8, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/6, "-"]);
    ref.animations.push(animations);

    // Move hand forward and slightly down (thank you gesture)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/3, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
    ref.animations.push(animations);

    // Return to neutral
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]); 
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
