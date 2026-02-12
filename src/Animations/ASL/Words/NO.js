// ASL: NO - Head shake with hand gesture
export const NO = (ref) => {
    let animations = [];

    // Raise hand to face level
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/3, "-"]);
    ref.animations.push(animations);

    // Shake left and right (3 times)
    for (let i = 0; i < 3; i++) {
        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/6, "+"]);
        ref.animations.push(animations);

        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "y", -Math.PI/6, "-"]);
        ref.animations.push(animations);
    }

    // Lower arm
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
