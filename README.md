mptl
====

create javascript class, OR Mapper and express rest api project from existing database with in 1 minutes!  
I hope this help you to create database related files.


## About
Mptl is a creator for database related files.  
This module analyze your database and generate Class and OR Mapper template for each Table and also generate sample RESTful API based on express.  
Created template can be customized as your project.

## Support
Sorry, this library only support MySQL.  
Other database like postgreSQL, SQLite and oracle etc will be supported in the near future.

- MySQL

## Installation
    $ npm install -g mptl


## Howto
###Command
    $ mptl -c db.property -t table.property -u ./template
 
    -c : path of databaase property file (mandatory)
    -t : path of table property file     (not mandatory)
    -u : path of template directory      (not mandatory)

## Setting
###Create database property file. (mandatory)
    # generate directory
    dir.gen=gen
    # created source directory
    dir.dao=dao
    dir.controller=ctrl
    dir.lib=lib
    # DB connection param
    db.type=mysql
    db.host=localhost
    db.port=3306
    db.database=your database name
    db.user=root
    db.password=root
###Create table property file.(not mandatory)
    # for all
    # use pooled connection
    sql.table.pool=true
    # enable select method
    sql.table.select=true
    # enable insert method
    sql.table.insert=true
    # enable update method
    sql.table.update=true
    # enable delete method
    sql.table.delete=true
    
    # customize sql by hand
    # If enable this, each column is directly managed in the query.
    sql.custom.select=true
    sql.custom.insert=true
    sql.custom.update=true
    sql.custom.delete=true

    # field. set default value in the field.
    sql.custom.field.created_at=UNIX_TIMESTAMP(now())
    sql.custom.field.updated_at=UNIX_TIMESTAMP(now())

    # if set tablename, properties are affected to selected table only.
    sql.custom.tablename.select=true
    sql.custom.tablename.insert=false
    sql.custom.tablename.update=false
    sql.custom.tablename.delete=false

    sql.custom.tablename.field.created_at=UNIX_TIMESTAMP(now())
    sql.custom.tablename.field.updated_at=UNIX_TIMESTAMP(now())
   
## Template
- This library create files with template file.
- Template files are written with ejs format.
- For the purpose of customize, this template have some redundant codes.
- By customizing this, you can easily create base or-mapper and class files for your site..

## Todo
- support following SQL.
 - postgresql, sqlite, oracle
- add template for each view(select, edit, new)
 

## License 

(The MIT License)

Copyright (c) 2012-2013 Shunsuke &lt;qfoori@gmail.com&gt;  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
