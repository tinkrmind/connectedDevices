PImage img;
import processing.serial.*;

Serial myPort;  
int val;      

void setup() 
{
  size(1379, 652);
  String portName = Serial.list()[0];
  myPort = new Serial(this, portName, 115200);
  img = loadImage("floorMap.png");
}

void draw()
{
  image(img, 0, 0);
  //val = myPort.read();         
}