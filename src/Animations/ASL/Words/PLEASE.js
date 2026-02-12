// ASL: PLEASE - Hand on chest in circular motion
export const PLEASE = (ref) => {
    let animations = [];

    // Hand to chest area
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "+"]);
    ref.animations.push(animations);

    // Circular motion (chest area)
    for (let i = 0; i < 2; i++) {
        animations = [];
        animations.push(["mixamorigRightArm", "rotation", "y", Math.PI/6, "+"]);
        ref.animations.push(animations);

        animations = [];
        animations.push(["mixamorigRightArm", "rotation", "y", -Math.PI/6, "-"]);
        ref.animations.push(animations);
    }

    // Return to neutral
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
