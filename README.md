# node-red-yeelight

Interact with yeelight lamps on local network. Select each lamp by their id and send them custom commands.

## Dependency
 
- [dgram](https://www.npmjs.com/package/dgram) 1.0.1
- [net](https://www.npmjs.com/package/net) 1.0.2

## Instalation

Install dependency before

    npm install dgram net

Clone the repository.

    git clone git@github.com:Azuxul/node-red-yeelight.git

Then go to your node red directory and install the package

   

    cd ~/.node-red
    npm install /path/to/repo


Or you can do everything in the same directory

    cd ~/.node-red
    git clone git@github.com:Azuxul/node-red-yeelight.git
    npm install ./node-red-yeelight

## Usage

You need to configure the node by entering the correct lamp id (ex: 0x000000000abc1234) and the command method (ex: set_power).
You can also set up the lamp name (internal to the node, not the yeelight lamp name) to access the last command method params as a node red global variable (with the name "main_lamp" for the method set_power, the variable is "main_lamp.set_power").

To use the node you need to pass arguments throw node red msg payload as an array. For example, with the method set_power msg.payload should be equals to :

    msg.payload = [state, 'smooth', 500]

For more information on commands methods and arguments use the [Yeelight WiFi Light Inter-Operation Specification Manual](https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf) or check [Yeelight developer website](https://www.yeelight.com/en_US/developer).

## Compatibility

This package has been fully tested with Yeelight color model (firmware version 70), Node-RED v0.20.7 and Node.Js v10.16.3.


