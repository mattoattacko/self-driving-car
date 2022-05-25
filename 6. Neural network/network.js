class NeuralNetwork {
    constructor(neuronCounts) { //constructor gets an array of neuronCounts (number of neurons in each layer)
        this.levels = []; //we make our neural network out of an array of levels
        for (let i = 0; i < neuronCounts.length - 1; i++) { //for each level, we specify the input and output count
            this.levels.push(new Level( //we make a new level with the neuron counts from the ith index, and the i+1 index.
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    static feedForward(givenInputs, network) { //givenInputs and a network
        //We get the outputs by calling the feedForward method from the level with the given inputs and the networks first level.
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]); //calls first level to produce its outputs.
        for (let i = 1; i < network.levels.length; i++) { // loop through remaining levels
            outputs = Level.feedForward( //update the outputs with the feedForward result from the level i.
                outputs, network.levels[i]); //we are putting in the outputs from the previous level in to the new level as the input.
        }
        return outputs; //final outputs will tell us if the car should go forward, left, right, or reverse.
    }
}

// Levels of the Network
class Level {
    constructor(inputCount, outputCount) { //level has a layer of input & output neurons
        this.inputs = new Array(inputCount); //values we get from the car sensors.
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount); //'bias' is the value above which the neuron fires

        //we will connect every input to every output neuron. The connections have 'weights'. 0 would be 0% of the connection, 1 would be 100% of the connection
        this.weights = [];
        for (let i = 0; i < inputCount; i++) { //goes through all inputs
            this.weights[i] = new Array(outputCount); //creates an array of weights. For each input node we have an output count number of connections.
        }

        Level.#randomize(this); //randomized brain to start with
    }

    //we write a static method because we want to serialize the object, and methods dont serialize.
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) { //given a level, go through all inputs
            for (let j = 0; j < level.outputs.length; j++) { //for each input, also go through its outputs
                level.weights[i][j] = Math.random() * 2 - 1; //for each input/output pair, give it a random weight. Between -1 and 1.
            }
        }

        //we use/need negative values for biases because if the car is close to the wall, the bias will be more negative on that side, so the car will know to turn away from the wall.
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    //Feed Forward Algorithm
    static feedForward(givenInputs, level) { //given some inputs, and a level, we go through all of the level inputs and set them to the given inputs. Those are the values from the sensor. 
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        //Get Outputs
        //to get the outputs, we loop through every outputs and calculate the sum of the value of the inputs and the weights.
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]) { //is the found sum greater than the bias of the output neuron? If so, set output neuron to 1 (turning it 'on'). Else the output will be set to zero.
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}