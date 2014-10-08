# PIM Model Reporter

## Description
This project provides a simple UI (presented via atom-shell) to display
differences between versions of inRiver's PIM model files.

## Setup
Start by installing all NPM and Bower packages using ```npm install``` and
```bower install```.

Next run ```gulp build``` to properly retrieve the atom-shell binaries and
deploy the code. You may then incrementally deploy code and automatically run
the application by executing the default task with ```gulp```.

You can retrieve the inRiver model files via the web admin interface by
navigating to ```Server > MODEL``` and choosing to "Download current model". If
you would just like to experiment with the tool, there are two sample models in
the ```data/``` directory at the root of the repository.
