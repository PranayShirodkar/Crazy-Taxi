import {defs, tiny} from './examples/common.js';

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
        this.move_forward = false;
        this.cam_z_loc = -30;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'tri': new Triangle(),
            'square': new Square(),
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, specularity: 1, color: hex_color("#ff0000")}),
            road: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 0, color: hex_color("#2A2A2A")}),
            lane_divider: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 0, color: hex_color("#FFFFFF")}),
            sand: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, specularity: 1, color: hex_color("#C2B280")}),
            mountain: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, specularity: 0, color: hex_color("#696969")}),
            mountain_tip: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#FFFFFF")}),
            sky: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, specularity: 1, color: hex_color("#87CEEB")}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        /*if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, -10, -30));
        }*/
        program_state.set_camera(Mat4.translation(0, -10, this.cam_z_loc));
        if(this.move_forward){
            this.cam_z_loc += 1;
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 250);

        // *** Lights: *** Values of vector or point lights.
        //Changed light position
        const light_position = vec4(0, -70, -5, 1);
        //Increased brightness
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10**5)];
    }
}

export class Crazy_Taxi extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */

    constructor(){
        super();
        this.far_z_loc = -218;
        this.chunks = 0;
    }

    move() {

    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Forward", ["w"], () => {
            this.move_forward = true;
        }, '#6E6460', () => {
            this.move_forward = false;
        });
        this.key_triggered_button("Left", ["a"], this.move);
        // Add a button for controlling the scene.
        this.key_triggered_button("Right", ["d"], () => {
        });
        this.key_triggered_button("Jump", ["spacebar"], () => {
        });
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        const yellow = hex_color("#ffe910");
        const gray = hex_color("#a0a0a0");
        let model_transform = Mat4.identity();

        // Example for drawing a cube, you can remove this line if needed
        //this.shapes.tri.draw(context, program_state, model_transform.times(Mat4.translation(0,2,-2)), this.materials.plastic.override({color:gray}));
        //this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override({color:yellow}));
        //this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(0,0,-4)), this.materials.plastic.override({color:yellow}));

        //Code to draw background
        //----------------------------------------------------------------------------------------------------------------------------------------

        if(this.move_forward){
            this.far_z_loc -= 1;
        }

        let road_transform = model_transform.times(Mat4.scale(20,1,110)).times(Mat4.translation(0,0.05,-.945)).times(Mat4.rotation(Math.PI/2,1,0,0));
        this.shapes.square.draw(context, program_state, road_transform, this.materials.road);
        
        let lane_divider_transform = model_transform.times(Mat4.scale(.25,1,2)).times(Mat4.translation(0,.1,0)).times(Mat4.rotation(Math.PI/2,1,0,0));
        for(let i = 0; i < 106; i+=5){
            this.shapes.square.draw(context, program_state, lane_divider_transform.times(Mat4.translation(-25,-i,0)), this.materials.lane_divider);
            this.shapes.square.draw(context, program_state, lane_divider_transform.times(Mat4.translation(25,-i,0)), this.materials.lane_divider);
        }
        
        let floor_transform = model_transform.times(Mat4.scale(180,1,110)).times(Mat4.translation(0,0,-.97)).times(Mat4.rotation(Math.PI/2,1,0,0));
        this.shapes.square.draw(context, program_state, floor_transform, this.materials.sand);

        let mountain_transform = model_transform.times(Mat4.scale(120,100,1)).times(Mat4.translation(0,.7,this.far_z_loc)).times(Mat4.rotation(5*Math.PI/4,0,0,1));
        this.shapes.tri.draw(context, program_state, mountain_transform, this.materials.mountain);
        this.shapes.tri.draw(context, program_state, mountain_transform.times(Mat4.translation(0.6,-0.6,.1)), this.materials.mountain);
        this.shapes.tri.draw(context, program_state, mountain_transform.times(Mat4.translation(-0.6,0.6,-.1)), this.materials.mountain);
        let mountain_tip_transform = model_transform.times(Mat4.scale(37,30,1)).times(Mat4.translation(0,2.33,this.far_z_loc+1)).times(Mat4.rotation(5*Math.PI/4,0,0,1));
        this.shapes.tri.draw(context, program_state, mountain_tip_transform, this.materials.mountain_tip);
        this.shapes.tri.draw(context, program_state, mountain_tip_transform.times(Mat4.translation(1.94,-1.94,0)), this.materials.mountain_tip);
        this.shapes.tri.draw(context, program_state, mountain_tip_transform.times(Mat4.translation(-1.94,1.94,0)), this.materials.mountain_tip);

        let sky_transform = model_transform.times(Mat4.scale(190,60,1)).times(Mat4.translation(0,1,this.far_z_loc-.5));
        this.shapes.square.draw(context, program_state, sky_transform, this.materials.sky);

        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(0,1,this.far_z_loc+218)), this.materials.plastic);
        //this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(-12,1,0)), this.materials.plastic);

    }
}