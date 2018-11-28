This was an experiment to see if I could train a neural network to classify GitHub issues and automatically apply the corresponding labels.

The repo I've used (firebase/firebase-js-sdk) has about 620 issues, which I'd say is fairly representative of the average GitHub project. Considering some of those need to be set aside as testing and validation datasets, that leaves barely 400 samples to train the network.

I still want to tweak some parameters of the model and play with different layer structures and optimimizers, but for now I'd say the available dataset is just not sufficient to train it successfully.
