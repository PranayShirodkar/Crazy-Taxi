import {defs, tiny} from './examples/common.js';
import {Shape_From_File} from './examples/obj-file-demo.js'

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Rounded_Capped_Cylinder, Subdivision_Sphere} = defs;

class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.move_forward = false;
        this.slowdown = false;
        this.cam_z_loc = -30;
        this.speedup_time = 0;
        this.slowdown_time = 0;
        this.collision_detected = false;
        this.collision_handling = false;
        this.speed = 0;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'tri': new Triangle(),
            'square': new Square(),
            'r_cyl': new Rounded_Capped_Cylinder(25, 50),
        };
        this.taxi_transform = Mat4.identity();
        this.taxi_color = hex_color("#FB9403");

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: 1, specularity: 1, color: hex_color("#ff0000")}),
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
            // car materials
            //------------------------------------------------------------------------
            chassis: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, specularity: 1, color: this.taxi_color}),
            wheel: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, specularity: 0, color: hex_color("#121212")}),
            wheelrim: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, specularity: 0, color: hex_color("#71797E")}),
            window: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#888888")}),
            taxisign: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, specularity: 1, color: hex_color("#FF3333")}),
            headlight: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#EEEE88")}),
            brakelight: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, specularity: 1, color: hex_color("#AA0000")}),
            blackpaint: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: 1, specularity: 1, color: hex_color("#000000")}),
            //------------------------------------------------------------------------
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

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        program_state.set_camera(Mat4.translation(0, -10, this.cam_z_loc));
        if(!this.collision_detected && !this.collision_handling) {
            if (this.move_forward) {
                if (this.speedup_time < 3.0) {
                    this.speedup_time += dt;
                    this.slowdown_time = 2 * this.speedup_time;
                } else {
                    this.speedup_time = 3;
                    this.slowdown_time = 6;
                }
                this.speed = Math.min(2, .5 + .5 * this.speedup_time);
            } else if (this.slowdown) {
                if (this.speedup_time > 0) {
                    this.speedup_time -= dt;
                    this.slowdown_time = 2 * this.speedup_time;
                } else {
                    this.speedup_time = 0;
                    this.slowdown_time = 0;
                }
                this.speed = Math.max(.5, .5 + .5 * this.speedup_time);
            } else {
                if (this.slowdown_time > 0) {
                    this.slowdown_time -= dt;
                    this.speedup_time = .5 * this.slowdown_time;
                } else {
                    this.slowdown_time = 0;
                    this.speedup_time = 0;
                }
                this.speed = (this.speed == 0) ? 0 : Math.max(.5, .5 + .25 * this.slowdown_time);
            }
        }
        else if (this.collision_detected) {
            this.collision_handling = true;
            this.collision_detected = false;
            this.speed = (-0.75 * this.speed);
            this.speedup_time = 0;
            this.slowdown_time = 0;
        }
        else if (this.collision_handling) {
            this.speed += dt*2;
            if (this.speed >= 0.5) {
                this.speed = 0.5
                this.collision_handling = false;
            }
        }

        this.cam_z_loc += this.speed;

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 250);

        // *** Lights: *** Values of vector or point lights.
        //Changed light position
        //const light_position = vec4(0, -70, -10, 1);
        const light_position = vec4(0, 10, -(this.cam_z_loc+30), 1);
        //Increased brightness
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10**4)];
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
        this.jump = false;
        this.jump_time = 0;
        this.far_z_loc = -216;
        this.chunks = 0;
        this.taxi_target_x_pos = 0;
        this.taxi_target_y_pos = 0;
        this.taxi_interpolated_xy_transform = Mat4.identity();
        this.lane_spacing = 13;
        this.traffic_speed = -6;
        this.traffic_layers = 4; // the constant numbers of traffic layers always maintained on road
        this.traffic_layer_count = 0; // count of total traffic layers so far
        this.traffic_layer_spacing = -60;
        this.cars_init_transform = [];
        this.cars_transform = [];
        this.cars_color = [];
        this.traffic_layer_patterns = [
        // [car in lane 1, car in lane 2, car in lane 3]
            [false, false, false],
            [true, false, false],
            [false, true, false],
            [false, false, true],
            [true, true, false],
            [false, true, true],
            [true, false, true],
            [true, true, true]];


        this.init_traffic();
    }

    init_traffic() {
        for (let i = 0; i < this.traffic_layers; i++) {
            this.insert_traffic_layer();
        }
    }

    insert_traffic_layer() {
        // select a traffic pattern randomly and insert cars into cars init array
        this.traffic_layer_count++;
        let random_traffic_pattern = this.traffic_layer_patterns[Math.floor(Math.random() * this.traffic_layer_patterns.length)];
        for (let i = 0; i < random_traffic_pattern.length; i++) {
            if (random_traffic_pattern[i]) {
                let x_pos = this.lane_spacing * (i - 1);
                let z_pos = this.traffic_layer_spacing * this.traffic_layer_count
                this.cars_init_transform.push(Mat4.translation(x_pos, 0, z_pos));
                this.cars_color.push(color((Math.random() * (0.8) + 0.2), (Math.random() * (0.8) + 0.2), (Math.random() * (0.8) + 0.2), 1));
            }
        }
    }

    update_traffic(context, program_state) {
        // make updates to this.cars_init_transform array and recalculate this.cars_transform array at the end
        this.cars_transform = []
        const t = program_state.animation_time / 1000;

        // determine the index of the cars that have been passed by
        let cars_to_remove = []
        let taxi_z_pos = this.taxi_transform[2][3];
        for (let i = 0; i < this.cars_init_transform.length; i++) {
            let car_z_pos = this.cars_init_transform[i][2][3] + (t * this.traffic_speed);
            if (car_z_pos - taxi_z_pos > 15) {cars_to_remove.push(i);}
        }

        // remove cars that have been passed by, starting with the largest to the smallest index
        // if we remove the smallest index first, all the remaining larger indices get changed, subsequent removals become wrong
        for (let i = cars_to_remove.length - 1; i >= 0; i--) {
            this.cars_init_transform.splice(cars_to_remove[i], 1)
            this.cars_color.splice(cars_to_remove[i], 1)
        }

        // if we have passed a traffic layer, insert new layer of traffic
        // do not just use car_z_pos here because some layers have no cars, but we should still insert a new layer
        let nearest_layer_z_pos = (this.traffic_layer_spacing * (this.traffic_layer_count - this.traffic_layers + 1)) + (t * this.traffic_speed);
        if (nearest_layer_z_pos > taxi_z_pos) {
            this.insert_traffic_layer();
        }

        // calculate this.cars_transform array from this.cars_init_transform array
        for (let i = 0; i < this.cars_init_transform.length; i++) {
            let car_transform = this.cars_init_transform[i].times(Mat4.translation(0, 0, t * this.traffic_speed))
            this.cars_transform.push(car_transform);
        }
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Forward", ["w"], () => {
            this.move_forward = true;
        }, '#6E6460', () => {
            this.move_forward = false;
        });
        this.key_triggered_button("Left", ["a"], () => {
            if(!this.jump){
                if (this.taxi_target_x_pos > (-1 * this.lane_spacing)) {
                    this.taxi_target_x_pos -= this.lane_spacing;
                }
            }
        });
        this.key_triggered_button("Right", ["d"], () => {
            if(!this.jump){
                if (this.taxi_target_x_pos < this.lane_spacing) {
                    this.taxi_target_x_pos += this.lane_spacing;
                }
            }
        });
        this.key_triggered_button("Slowdown", ["s"], () => {
            this.slowdown = true;
        }, '#6E6460', () => {
            this.slowdown = false;
        });
        this.key_triggered_button("Jump", [" "], () => {
            if(this.taxi_target_y_pos == 0 && !this.jump){
                this.jump = true;
            }
        });
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        const yellow = hex_color("#ffe910");
        const gray = hex_color("#a0a0a0");
        let model_transform = Mat4.identity();
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        //Code to draw background
        //----------------------------------------------------------------------------------------------------------------------------------------

        /*if(this.move_forward){
            this.far_z_loc -= this.speed;
        }else if(this.slowdown){
            this.far_z_loc -= this.speed
        }else{
            this.far_z_loc -= this.speed;
        }*/
        this.far_z_loc -= this.speed;

        /*if(this.far_z_loc % 220 == 0 && this.far_z_loc != -220){
            this.chunks += 1;
        }*/
        if(this.far_z_loc < -220*(this.chunks+2) && this.far_z_loc > -220*(this.chunks+3)){
            this.chunks += 1;
        }

        let current_road_transform = model_transform.times(Mat4.scale(20,1,110)).times(Mat4.translation(0,0.05,-.945-2*this.chunks)).times(Mat4.rotation(Math.PI/2,1,0,0));
        let next_road_transform = model_transform.times(Mat4.scale(20,1,110)).times(Mat4.translation(0,0.05,-.945-2*(this.chunks+1))).times(Mat4.rotation(Math.PI/2,1,0,0));
        this.shapes.square.draw(context, program_state, current_road_transform, this.materials.road);
        this.shapes.square.draw(context, program_state, next_road_transform, this.materials.road);
        
        let lane_divider_transform = model_transform.times(Mat4.scale(.25,1,2)).times(Mat4.translation(0,.1,0)).times(Mat4.rotation(Math.PI/2,1,0,0));
        for(let i = 0; i < 106; i+=5){
            this.shapes.square.draw(context, program_state, lane_divider_transform.times(Mat4.translation(-25,-i-(110*this.chunks),0)), this.materials.lane_divider);
            this.shapes.square.draw(context, program_state, lane_divider_transform.times(Mat4.translation(25,-i-(110*this.chunks),0)), this.materials.lane_divider);
            this.shapes.square.draw(context, program_state, lane_divider_transform.times(Mat4.translation(-25,-i-(110*(this.chunks+1)),0)), this.materials.lane_divider);
            this.shapes.square.draw(context, program_state, lane_divider_transform.times(Mat4.translation(25,-i-(110*(this.chunks+1)),0)), this.materials.lane_divider);
        }
        
        let current_floor_transform = model_transform.times(Mat4.scale(180,1,110)).times(Mat4.translation(0,0,-.945-2*this.chunks)).times(Mat4.rotation(Math.PI/2,1,0,0));
        let next_floor_transform = model_transform.times(Mat4.scale(180,1,110)).times(Mat4.translation(0,0,-.945-2*(this.chunks+1))).times(Mat4.rotation(Math.PI/2,1,0,0));
        this.shapes.square.draw(context, program_state, current_floor_transform, this.materials.sand);
        this.shapes.square.draw(context, program_state, next_floor_transform, this.materials.sand);

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

        // this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(0,1,this.far_z_loc+218)), this.materials.plastic);
        //this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(-12,1,0)), this.materials.plastic);

        //Code to draw a car
        //----------------------------------------------------------------------------------------------------------------------------------------
        this.update_objects(context, program_state);
        this.draw_objects(context, program_state);
        this.detect_collision(context, program_state);

    }

    update_objects(context, program_state) {
        // handle taxi jump
        if(this.jump){
            this.jump_time += program_state.animation_delta_time / 1000;
            this.taxi_target_y_pos = (this.taxi_target_y_pos >= 0) ? -160*(this.jump_time**2 - .5*this.jump_time) : 0;
            if(this.taxi_target_y_pos == 0) this.jump = false;
        }else{ this.jump_time = 0; }

        // interpolate taxi transform
        let target_xy_transform = Mat4.translation(this.taxi_target_x_pos, this.taxi_target_y_pos, 0);
        this.taxi_interpolated_xy_transform = target_xy_transform.map((x, i) => Vector.from(this.taxi_interpolated_xy_transform[i]).mix(x, 0.2));

        // update taxi transform
        this.taxi_transform = this.taxi_interpolated_xy_transform.times(Mat4.translation(0, 0, this.far_z_loc + 218));

        // move cars in traffic at constant speed, remove passed by cars, generate new cars ahead
        this.update_traffic(context, program_state);

        //--------------------- add additional object updates here------------//

    }

    draw_objects(context, program_state) {
        // draw taxi
        this.draw_car(context, program_state, true, this.taxi_transform);

        // draw cars in traffic
        for (let i = 0; i < this.cars_transform.length; i++) {
            this.draw_car(context, program_state, false, this.cars_transform[i], this.cars_color[i]);
        }

        //--------------------- insert additional draw calls here------------//
    }

    draw_car(context, program_state, taxi, model_transform, color = this.taxi_color) {
        // wheel_transform = wheel_transform.times(Mat4.rotation(-Math.PI / 4, 1, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(0, 2, 0)).times(Mat4.scale(2.4, 1, 6)), this.materials.chassis.override({color: color}));
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(0, 4, 0)).times(Mat4.scale(2.4, 1, 3)), this.materials.chassis.override({color: color}));
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(-2, 1.05, -3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)), this.materials.wheel);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(-2, 1.05, 3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)), this.materials.wheel);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(2, 1.05, -3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)), this.materials.wheel);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(2, 1.05, 3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)), this.materials.wheel);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(-2.05, 1.05, -3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.scale(0.6, 0.6, 1)), this.materials.wheelrim);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(-2.05, 1.05, 3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.scale(0.6, 0.6, 1)), this.materials.wheelrim);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(2.05, 1.05, -3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.scale(0.6, 0.6, 1)), this.materials.wheelrim);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(2.05, 1.05, 3)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.scale(0.6, 0.6, 1)), this.materials.wheelrim);
        this.shapes.square.draw(context, program_state, model_transform.times(Mat4.translation(0, 4, -3.01)).times(Mat4.scale(2.2, 0.8, 1)), this.materials.window);
        this.shapes.square.draw(context, program_state, model_transform.times(Mat4.translation(0, 4, 3.01)).times(Mat4.scale(2.2, 0.8, 1)), this.materials.window);
        this.shapes.square.draw(context, program_state, model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(-1.5, 4, 2.41)).times(Mat4.scale(1.3, 0.8, 1)), this.materials.window);
        this.shapes.square.draw(context, program_state, model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(1.5, 4, 2.41)).times(Mat4.scale(1.3, 0.8, 1)), this.materials.window);
        this.shapes.square.draw(context, program_state, model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(-1.5, 4, -2.41)).times(Mat4.scale(1.3, 0.8, 1)), this.materials.window);
        this.shapes.square.draw(context, program_state, model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(1.5, 4, -2.41)).times(Mat4.scale(1.3, 0.8, 1)), this.materials.window);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(1.5, 2.4, -5.6)).times(Mat4.scale(0.5, 0.5, 1)), this.materials.headlight);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(-1.5, 2.4, -5.6)).times(Mat4.scale(0.5, 0.5, 1)), this.materials.headlight);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(1.5, 2.4, 5.6)).times(Mat4.scale(0.7, 0.2, 1)), this.materials.brakelight);
        this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.translation(-1.5, 2.4, 5.6)).times(Mat4.scale(0.7, 0.2, 1)), this.materials.brakelight);
        if(taxi) {
            this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(0, 5.5, 0)).times(Mat4.scale(1, 0.5, 0.4)), this.materials.taxisign);
            this.shapes.square.draw(context, program_state, model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(0, 2.3, -2.41)).times(Mat4.scale(6, 0.2, 1)), this.materials.blackpaint);
            this.shapes.square.draw(context, program_state, model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(0, 2.3, 2.41)).times(Mat4.scale(6, 0.2, 1)), this.materials.blackpaint);
            this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)).times(Mat4.translation(0, 2.3, 2.41)).times(Mat4.scale(2.5, 0.7, 0.02)), this.materials.blackpaint);
            this.shapes.r_cyl.draw(context, program_state, model_transform.times(Mat4.rotation(-Math.PI / 2, 0, 1, 0)).times(Mat4.translation(0, 2.3, 2.41)).times(Mat4.scale(2.5, 0.7, 0.02)), this.materials.blackpaint);
        }
    }

    detect_collision(context, program_state) {
        let taxi_x_pos = this.taxi_target_x_pos;
        let taxi_y_pos = this.taxi_transform[1][3];
        let taxi_z_pos = this.taxi_transform[2][3];
        for (let i = 0; i < this.cars_transform.length; i++) {
            let car_x_pos = this.cars_transform[i][0][3];
            let car_y_pos = this.cars_transform[i][1][3];
            let car_z_pos = this.cars_transform[i][2][3];
            let collision_detected = false;
            if ((taxi_z_pos > car_z_pos) &&
                (taxi_z_pos - car_z_pos < 12.3) &&
                (taxi_y_pos - car_y_pos < 3) &&
                (Math.abs(taxi_x_pos - car_x_pos) < 4.8)) {collision_detected = true;this.collision_detected = true;}
            if (collision_detected) {
                this.cars_color[i] = hex_color("#FF0000");
            }
        }
    }
}