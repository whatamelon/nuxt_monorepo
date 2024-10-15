#!/bin/sh

if [ '${BUILD_ENV}' = 'PROD' ] ; then 
  export DOT_ENV='.env' ; 
else
  export DOT_ENV='.env.dev' ;
fi;

echo "DOT_ENV: $DOT_ENV"

./node_modules/.bin/nuxt start --dotenv $DOT_ENV
