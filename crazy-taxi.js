import {defs, tiny} from './examples/common.js';
import {Skull} from './skull.js'
import {Cactus} from './cactus.js'

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere} = defs;

class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'tri': new Triangle(),
            'skull': new Skull(),
            'cactus': new Cactus()
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            skull: new Material(new defs.Phong_Shader(),
                {ambient: .5, diffusivity: .3, specularity: .5, color: hex_color("#ffffff")}),
            cactus: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .1, specularity: .1, color: hex_color("#29910f")}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Crazy_Taxi extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */

    move() {

    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Left", ["a"], this.move);
        // Add a button for controlling the scene.
        this.key_triggered_button("Right", ["d"], () => {
        });
        this.key_triggered_button("Jump", ["w"], () => {
        });
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        const yellow = hex_color("#ffe910");
        const gray = hex_color("#a0a0a0");
        const white = hex_color("#ffffff");
        let model_transform = Mat4.identity();

        // Example for drawing a cube, you can remove this line if needed
        this.shapes.skull.draw(context, program_state, model_transform.times(Mat4.translation(-6,0,0)), this.materials.skull);
        this.shapes.cactus.draw(context, program_state, model_transform.times(Mat4.translation(6,0,0)), this.materials.cactus);
    }
}