#include <SPI.h>
#include "printf.h"
#include "RF24.h"

#define SECUNDA 1000

const byte WakeUpTime = 10;
const byte UpdateTime = 5;
const byte ledPin = 13;
const byte interruptPin = 2;
volatile byte state = LOW;


unsigned long timeSinceLastUpdate = 0;
unsigned long counterUpdatePeriod = 0;
uint16_t counter = 0;

byte sleepMode = false;

RF24 radio(7, 8); // using pin 7 for the CE pin, and pin 8 for the CSN pin

uint8_t address[][6] = {"Node1", "Node1"};

bool radioNumber = 1; // 0 uses address[0] to transmit, 1 uses address[1] to transmit

// Used to control whether this node is sending or receiving
bool role = false;  // true = TX role, false = RX role

bool report;

void setup() {
  
  Serial.begin(115200);
  while (!Serial) {
    // some boards need to wait to ensure access to serial over USB
  }

  // initialize the transceiver on the SPI bus
  if (!radio.begin()) {
    Serial.println(F("radio hardware is not responding!!"));
    while (1) {} // hold in infinite loop
  }

  radio.setAutoAck(false);

  radio.setPALevel(RF24_PA_LOW);  // RF24_PA_MAX is default.

  radio.setPayloadSize(sizeof(counter)); // float datatype occupies 4 bytes

  // set the TX address of the RX node into the TX pipe
  radio.openWritingPipe(address[radioNumber]);     // always uses pipe 0

  // set the RX address of the TX node into a RX pipe
  radio.openReadingPipe(1, address[!radioNumber]); // using pipe 1


  radio.stopListening();  // put radio in TX mode
  
  pinMode(ledPin, OUTPUT);
  pinMode(interruptPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(interruptPin), blink, FALLING);
}

void loop() {
  digitalWrite(ledPin, state);

  if(!sleepMode)
  {
    if((millis() / SECUNDA) - timeSinceLastUpdate >= WakeUpTime)
    {
        
    Serial.println("Go to sleep!");
    sleepMode = true;
    }

    if((millis() / SECUNDA) - counterUpdatePeriod >= UpdateTime)
    {
      
      

      if(counter)
      {
         Serial.print("Counter is: ");
         Serial.println(counter);
         report = radio.write(&counter, sizeof(uint16_t));      // transmit & save the report
        
      }
     
      if(report && counter)
      {    
        Serial.println("Transmission successful! ");          // payload was delivered
        counter = 0;
        Serial.println("Reset counter!");
      }else
      {
        if(counter)
        {
          Serial.println("Transmission failed or timed out"); // payload was not delivered  
        }else{

          Serial.println("Counter Not Updated");
          }
        
      }
      
      
     

      counterUpdatePeriod = millis() / SECUNDA;
        
    }
    
   }
}


void blink() {

  if(sleepMode)
  {
      Serial.println("Wake up!");
      sleepMode = false;
  }
  state = !state;
  counter++;

  Serial.print("New counter: ");
  Serial.println(counter);
  
  timeSinceLastUpdate = millis() / SECUNDA;
  
  Serial.print("New time:");
  Serial.println(timeSinceLastUpdate);
  
}
