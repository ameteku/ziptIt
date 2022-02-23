import numpy as np

input  =2
weight  =1
goalPrediction = 0.8
step = 0.1


for i in range(0,100):
    prediction = weight * input
    error = (prediction - goalPrediction) ** 2
    weight_delta = input * (prediction - goalPrediction)
    weight = weight - weight_delta * step
    print("Error is" + str(error) + "with prediction of" + str(prediction))
