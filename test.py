import numpy as np

np.random.seed(1)
# input  =2
# weight  =1
# goalPrediction = 0.8
# step = 0.1


# for i in range(0,100):
#     prediction = weight * input
#     error = (prediction - goalPrediction) ** 2
#     weight_delta = input * (prediction - goalPrediction)
#     weight = weight - weight_delta * step
#     print("Error is" + str(error) + "with prediction of" + str(prediction))

def neuralNetwork(input, weights):
    pred = input.dot(weights)
    return pred

input = np.array([[1,0,1], [0,1,1], [0,0,1], [1,1,1], [0,1,1], [1,0,1]])
expectedOutputs = np.array([1,0,1,0,1,0])

def train1(inputs, outputs):
    step = 0.1
    weights = np.array([.5,.4,0.6])
    for iteration in range(60):
        iterationError = 0
        for sampleIndex in range(len(inputs)):
            pred = inputs[sampleIndex].dot(weights)
            error = (pred - outputs[sampleIndex]) ** 2
            iterationError += error
            delta = pred - outputs[sampleIndex]
            weightDelta = delta * inputs[sampleIndex]
            weights = weights - (step * weightDelta)
            print ("Error: " + str(error)+ " prediction is" + str(pred))
        print("Iteration" + str(iteration) + "end with error: " + str(iterationError) )
        iterationError = 0
    print("Weights are" + str(weights))

def relu(num):
     return (num > 0) * num

def train2(inputs, outputs):
    layer1Weights = np.random.random(())

#train1(input, expectedOutputs)