// ASL: YES - Fist nods up and down
export const YES = (ref) => {
    let animations = [];

    // Raise fist to mid-chest
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/6, "-"]);
    ref.animations.push(animations);

    // Nod up and down (3 times)
    for (let i = 0; i < 3; i++) {
        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI/8, "+"]);
        ref.animations.push(animations);

        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/8, "-"]);
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
