// ASL: LOVE - Cross arms over heart
export const LOVE = (ref) => {
    let animations = [];

    // Cross right arm over chest
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "y", Math.PI/3, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/4, "+"]);
    ref.animations.push(animations);

    // Cross left arm
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI/6, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "y", -Math.PI/3, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/4, "-"]);
    ref.animations.push(animations);

    // Hold briefly
    animations = [];
    ref.animations.push(animations);

    // Release
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
