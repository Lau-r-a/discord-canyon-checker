# Canyon Discord Availability Bot

### Work in Progress

A discord bot scraping Canyon Prduct pages and notifying for product availability.

## Environment Parameters

#### DISCORD_TOKEN
Your discrod bot token

#### DISCORD_APPLICATION_ID
Your discord appliccation id

#### MINUTES_TO_WAIT
The execution of the scrape interval in minutes

#### NOT_AVAILABLE_SEND_INTERVAL_HOURS
The time frame to send messages even though the product is not available 

#### MONGO_INITDB_ROOT_USERNAME
MongoDB username

#### MONGO_INITDB_ROOT_PASSWORD
secure MongoDB password

## Commands

#### `/add_url` 
Add a url to scrape in your setup interval

Options:
* url of the product page to scrape
* sizes Sizes to notify availability on seperated by "," e.g. XL,L

#### `/list_url`
Returns a list of all urls and their sizes registered by the user

#### `/delete_url`
Remove a url to scrape

Options:
* url of the product page to remove

#### `/help`

List all availabale commands


## Execution

### Using docker-compose

* Rename file `.env-example` into `.env` and adjust your parameters accordingly
* Simply execute `docker-compose up` to run everything required for the bot to work.

