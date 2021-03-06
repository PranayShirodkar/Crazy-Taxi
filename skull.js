import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere} = defs;

class Skull extends Shape {
    constructor() {
        super("position", "normal");
       
        this.arrays.position = Vector3.cast(
        [-2, -1, -1], [1.5, -1, 1], [-1.5, -1, 1], 
        [-2, -1, -1], [1.5, -1, 1], [2, -1, -1],
        [-2, 1, -1], [1, 0.5, 1], [-1, 0.5, 1], 
        [-2, 1, -1], [1, 0.5, 1], [2, 1, -1],
        [-1.5, -1, 1], [1, 0.5, 1], [1.5, -1, 1], 
        [-1.5, -1, 1], [1, 0.5, 1], [-1, 0.5, 1],
        [1.5, -1, 1], [2, 1, -1], [2, -1, -1], 
        [1.5, -1, 1], [2, 1, -1], [1, 0.5, 1],
        [2, -1, -1], [-2, 1, -1], [-2, -1, -1], 
        [2, -1, -1], [-2, 1, -1], [2, 1, -1],
        [-2, -1, -1], [-1, 0.5, 1], [-1.5, -1, 1],
        [-2, -1, -1], [-1, 0.5, 1], [-1.5, -1, 1],

        [-2, 1, -1], [-2, 1, -2.5], [2, 1, -1],
        [2, 1, -1], [-2, 1, -2.5], [2, 1, -2.5],
        [-2, 1, -1], [-2, 0, -2.5], [-2, 1, -2.5],
        [-2, 1, -1], [-2, 0, -2.5], [-2, 0, -1],
        [2, 1, -1], [2, 0, -2.5], [2, 1, -2.5],
        [2, 1, -1], [2, 0, -2.5], [2, 0, -1],
        [-2, 1, -2.5], [2, 0, -2.5], [2, 1, -2.5],
        [-2, 1, -2.5], [2, 0, -2.5], [-2, 0, -2.5],
        [-2, 0, -1], [2, 0, -2.5], [-2, 0, -2.5],
        [-2, 0, -1], [2, 0, -2.5], [2, 0, -1],

        [-1, 0.5, 1], [-0.8, -0.3, 3], [-1.5, -1, 1],
        [1, 0.5, 1], [0.8, -0.3, 3], [1.5, -1, 1],
        [-0.8, -0.3, 3], [-0.8, -1, 3], [-1.5, -1, 1],
        [0.8, -0.3, 3], [0.8, -1, 3], [1.5, -1, 1],
        [-1, 0.5, 1], [-0.8, -0.3, 3], [1, 0.5, 1],
        [1, 0.5, 1], [0.8, -0.3, 3], [-0.8, -0.3, 3],
        [-1.5, -1, 1], [1.5, -1, 1], [-0.8, -1, 3],
        [1.5, -1, 1], [-0.8, -1, 3], [0.8, -1, 3],
        [-0.8, -0.3, 3], [0.8, -1, 3], [-0.8, -1, 3],
        [0.8, -0.3, 3], [-0.8, -0.3, 3], [0.8, -1, 3],

        [-0.8, -0.3, 3], [-0.5, -1, 5], [-0.8, -1, 3],
        [0.8, -0.3, 3], [0.5, -1, 5], [0.8, -1, 3],
        [-0.8, -0.3, 3], [-0.5, -1, 5], [0, -0.7, 3],
        [0.8, -0.3, 3], [0.5, -1, 5], [0, -0.7, 3],
        [0, -0.7, 3], [-0.5, -1, 5], [-0.8, -1, 3],
        [0, -0.7, 3], [0.5, -1, 5], [0.8, -1, 3],

        [-2, 1, -2.5], [-0.2, 1, -3], [-0.2, 1, -2.5],
        [2, 1, -2.5], [0.2, 1, -3], [0.2, 1, -2.5],
        [-2, 0, -2.5], [-0.2, 0, -3], [-0.2, 0, -2.5],
        [2, 0, -2.5], [0.2, 0, -3], [0.2, 0, -2.5],
        [-2, 1, -2.5], [-0.2, 1, -3], [-2, 0, -2.5],
        [2, 1, -2.5], [0.2, 1, -3], [2, 0, -2.5],
        [-2, 0, -2.5], [-0.2, 1, -3], [-0.2, 0, -3],
        [2, 0, -2.5], [0.2, 1, -3], [0.2, 0, -3],
        [-0.2, 1, -2.5], [-0.2, 1, -3], [-0.2, 0, -2.5], 
        [0.2, 1, -2.5], [0.2, 1, -3], [0.2, 0, -2.5],
        [-0.2, 0, -2.5], [-0.2, 1, -3], [-0.2, 0, -3],
        [0.2, 0, -2.5], [0.2, 1, -3], [0.2, 0, -3],

        [-2, 1, -1], [-4, 2, -2], [-1.5, 1, -1],
        [2, 1, -1], [4, 2, -2], [1.5, 1, -1],
        [-1.5, 1, -1], [-4, 2, -2], [-3.5, 2, -2],
        [1.5, 1, -1], [4, 2, -2], [3.5, 2, -2],
        [-1.5, 1, -1], [-3.5, 2, -2], [-1.5, 1, -1.5],
        [1.5, 1, -1], [3.5, 2, -2], [1.5, 1, -1.5],
        [-1.5, 1, -1.5], [-3.5, 2, -2], [-3.5, 2, -2.5],
        [1.5, 1, -1.5], [3.5, 2, -2], [3.5, 2, -2.5],
        [-1.5, 1, -1.5], [-3.5, 2, -2.5], [-2, 1, -1.5],
        [1.5, 1, -1.5], [3.5, 2, -2.5], [2, 1, -1.5],
        [-2, 1, -1.5], [-3.5, 2, -2.5], [-4, 2, -2.5],
        [2, 1, -1.5], [3.5, 2, -2.5], [4, 2, -2.5],
        [-2, 1, -1.5], [-4, 2, -2.5], [-2, 1, -1],
        [2, 1, -1.5], [4, 2, -2.5], [2, 1, -1],
        [-2, 1, -1], [-4, 2, -2.5], [-4, 2, -2],
        [2, 1, -1], [4, 2, -2.5], [4, 2, -2],
        [-4, 2, -2], [-6, 6, -2], [-3.5, 2, -2],
        [4, 2, -2], [6, 6, -2], [3.5, 2, -2],
        [-3.5, 2, -2], [-6, 6, -2], [-3.5, 2, -2.5],
        [3.5, 2, -2], [6, 6, -2], [3.5, 2, -2.5],
        [-3.5, 2, -2.5], [-6, 6, -2], [-4, 2, -2.5],
        [3.5, 2, -2.5], [6, 6, -2], [4, 2, -2.5],
        [-4, 2, -2.5], [-6, 6, -2], [-4, 2, -2],
        [4, 2, -2.5], [6, 6, -2], [4, 2, -2]
        );

        this.arrays.normal = Vector3.cast(
        [-2, -1, -1], [1.5, -1, 1], [-1.5, -1, 1], 
        [-2, -1, -1], [1.5, -1, 1], [2, -1, -1],
        [-2, 1, -1], [1, 0.5, 1], [-1, 0.5, 1], 
        [-2, 1, -1], [1, 0.5, 1], [2, 1, -1],
        [-1.5, -1, 1], [1, 0.5, 1], [1.5, -1, 1], 
        [-1.5, -1, 1], [1, 0.5, 1], [-1, 0.5, 1],
        [1.5, -1, 1], [2, 1, -1], [2, -1, -1], 
        [1.5, -1, 1], [2, 1, -1], [1, 0.5, 1],
        [2, -1, -1], [-2, 1, -1], [-2, -1, -1], 
        [2, -1, -1], [-2, 1, -1], [2, 1, -1],
        [-2, -1, -1], [-1, 0.5, 1], [-1.5, -1, 1],
        [-2, -1, -1], [-1, 0.5, 1], [-1.5, -1, 1],

        [-2, 1, -1], [-2, 1, -2.5], [2, 1, -1],
        [2, 1, -1], [-2, 1, -2.5], [2, 1, -2.5],
        [-2, 1, -1], [-2, 0, -2.5], [-2, 1, -2.5],
        [-2, 1, -1], [-2, 0, -2.5], [-2, 0, -1],
        [2, 1, -1], [2, 0, -2.5], [2, 1, -2.5],
        [2, 1, -1], [2, 0, -2.5], [2, 0, -1],
        [-2, 1, -2.5], [2, 0, -2.5], [2, 1, -2.5],
        [-2, 1, -2.5], [2, 0, -2.5], [-2, 0, -2.5],
        [-2, 0, -1], [2, 0, -2.5], [-2, 0, -2.5],
        [-2, 0, -1], [2, 0, -2.5], [2, 0, -1],

        [-1, 0.5, 1], [-0.8, -0.3, 3], [-1.5, -1, 1],
        [1, 0.5, 1], [0.8, -0.3, 3], [1.5, -1, 1],
        [-0.8, -0.3, 3], [-0.8, -1, 3], [-1.5, -1, 1],
        [0.8, -0.3, 3], [0.8, -1, 3], [1.5, -1, 1],
        [-1, 0.5, 1], [-0.8, -0.3, 3], [1, 0.5, 1],
        [1, 0.5, 1], [0.8, -0.3, 3], [-0.8, -0.3, 3],
        [-1.5, -1, 1], [1.5, -1, 1], [-0.8, -1, 3],
        [1.5, -1, 1], [-0.8, -1, 3], [0.8, -1, 3],
        [-0.8, -0.3, 3], [0.8, -1, 3], [-0.8, -1, 3],
        [0.8, -0.3, 3], [-0.8, -0.3, 3], [0.8, -1, 3],

        [-0.8, -0.3, 3], [-0.5, -1, 5], [-0.8, -1, 3],
        [0.8, -0.3, 3], [0.5, -1, 5], [0.8, -1, 3],
        [-0.8, -0.3, 3], [-0.5, -1, 5], [0, -0.7, 3],
        [0.8, -0.3, 3], [0.5, -1, 5], [0, -0.7, 3],
        [0, -0.7, 3], [-0.5, -1, 5], [-0.8, -1, 3],
        [0, -0.7, 3], [0.5, -1, 5], [0.8, -1, 3],

        [-2, 1, -2.5], [-0.2, 1, -3], [-0.2, 1, -2.5],
        [2, 1, -2.5], [0.2, 1, -3], [0.2, 1, -2.5],
        [-2, 0, -2.5], [-0.2, 0, -3], [-0.2, 0, -2.5],
        [2, 0, -2.5], [0.2, 0, -3], [0.2, 0, -2.5],
        [-2, 1, -2.5], [-0.2, 1, -3], [-2, 0, -2.5],
        [2, 1, -2.5], [0.2, 1, -3], [2, 0, -2.5],
        [-2, 0, -2.5], [-0.2, 1, -3], [-0.2, 0, -3],
        [2, 0, -2.5], [0.2, 1, -3], [0.2, 0, -3],
        [-0.2, 1, -2.5], [-0.2, 1, -3], [-0.2, 0, -2.5], 
        [0.2, 1, -2.5], [0.2, 1, -3], [0.2, 0, -2.5],
        [-0.2, 0, -2.5], [-0.2, 1, -3], [-0.2, 0, -3],
        [0.2, 0, -2.5], [0.2, 1, -3], [0.2, 0, -3],

        [-2, 1, -1], [-4, 2, -2], [-1.5, 1, -1],
        [2, 1, -1], [4, 2, -2], [1.5, 1, -1],
        [-1.5, 1, -1], [-4, 2, -2], [-3.5, 2, -2],
        [1.5, 1, -1], [4, 2, -2], [3.5, 2, -2],
        [-1.5, 1, -1], [-3.5, 2, -2], [-1.5, 1, -1.5],
        [1.5, 1, -1], [3.5, 2, -2], [1.5, 1, -1.5],
        [-1.5, 1, -1.5], [-3.5, 2, -2], [-3.5, 2, -2.5],
        [1.5, 1, -1.5], [3.5, 2, -2], [3.5, 2, -2.5],
        [-1.5, 1, -1.5], [-3.5, 2, -2.5], [-2, 1, -1.5],
        [1.5, 1, -1.5], [3.5, 2, -2.5], [2, 1, -1.5],
        [-2, 1, -1.5], [-3.5, 2, -2.5], [-4, 2, -2.5],
        [2, 1, -1.5], [3.5, 2, -2.5], [4, 2, -2.5],
        [-2, 1, -1.5], [-4, 2, -2.5], [-2, 1, -1],
        [2, 1, -1.5], [4, 2, -2.5], [2, 1, -1],
        [-2, 1, -1], [-4, 2, -2.5], [-4, 2, -2],
        [2, 1, -1], [4, 2, -2.5], [4, 2, -2],
        [-4, 2, -2], [-6, 6, -2], [-3.5, 2, -2],
        [4, 2, -2], [6, 6, -2], [3.5, 2, -2],
        [-3.5, 2, -2], [-6, 6, -2], [-3.5, 2, -2.5],
        [3.5, 2, -2], [6, 6, -2], [3.5, 2, -2.5],
        [-3.5, 2, -2.5], [-6, 6, -2], [-4, 2, -2.5],
        [3.5, 2, -2.5], [6, 6, -2], [4, 2, -2.5],
        [-4, 2, -2.5], [-6, 6, -2], [-4, 2, -2],
        [4, 2, -2.5], [6, 6, -2], [4, 2, -2]
        );
        
        this.indices = false;
    }
}

export {Skull};