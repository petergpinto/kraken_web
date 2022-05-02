#!/usr/bin/env python

from sqlalchemy import create_engine
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.sql.expression import Insert
from dotenv import load_dotenv
import numpy as np
import pandas as pd
import os

con_str = "mysql+pymysql://"+os.environ['MYSQL_DB_USER']+":"+os.environ['MYSQL_DB_PASS']+"@"+os.environ['MYSQL_DB_HOST']+"/"+os.environ['MYSQL_DB_NAME']
conn = create_engine(con_str)

@compiles(Insert)
def _prefix_insert_with_ignore(insert, compiler, **kw):
    return compiler.visit_insert(insert.prefix_with('IGNORE'), **kw)


df = pd.read_sql("SELECT * FROM ohlc_data limit 1", con=conn)
print(df)
