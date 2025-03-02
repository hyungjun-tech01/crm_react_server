-- 기업관리 테이블 

drop table if exists tbl_company_info;

create table tbl_company_info
(company_code                 varchar	(32)   PRIMARY KEY,
company_number               varchar	(50)   ,
group_                        varchar	(255)  ,
company_scale                varchar	(100)  ,
deal_type                    varchar	(100)  ,
company_name                 varchar	(50)   ,
company_name_eng             varchar	(100)  ,
business_registration_code   varchar	(50)   ,
establishment_date           date	         ,
closure_date                 date	         ,
ceo_name                     varchar	(50)   ,
business_type                varchar	(100)  ,
business_item                varchar	(100)  ,
industry_type                varchar	(50)   ,
company_zip_code             varchar	(50)   ,
company_address              varchar	(255)  ,
company_phone_number         varchar	(50)   ,
company_fax_number           varchar	(50)   ,
homepage                     varchar	(255)  ,
memo                         text	         ,
create_user                  varchar	(50)   ,
create_date                  timestamp	         ,
modify_date                  timestamp	         ,
recent_user                  varchar	(50)   ,
counter                      integer	     ,
account_code                 varchar	(50)   ,
bank_name                    varchar	(50)   ,
account_owner                varchar	(50)   ,
sales_resource               varchar	(50)   ,
application_engineer         varchar	(50)   ,
region                       varchar	(50)   
);

create table tbl_company_info_temp
(company_code                 varchar	(32)   PRIMARY KEY,
company_number               varchar	(50)   ,
group_                        varchar	(255)  ,
company_scale                varchar	(100)  ,
deal_type                    varchar	(100)  ,
company_name                 varchar	(50)   ,
company_name_eng             varchar	(100)  ,
business_registration_code   varchar	(50)   ,
establishment_date           varchar	(50)	         ,
closure_date                 varchar	(50)	         ,
ceo_name                     varchar	(50)   ,
business_type                varchar	(100)  ,
business_item                varchar	(100)  ,
industry_type                varchar	(50)   ,
company_zip_code             varchar	(50)   ,
company_address              varchar	(255)  ,
company_phone_number         varchar	(50)   ,
company_fax_number           varchar	(50)   ,
homepage                     varchar	(255)  ,
memo                         text	         ,
create_user                  varchar	(50)   ,
create_date                  varchar	(50)	         ,
modify_date                  varchar	(50)	         ,
recent_user                  varchar	(50)   ,
counter                      varchar	(50)	     ,
account_code                 varchar	(50)   ,
bank_name                    varchar	(50)   ,
account_owner                varchar	(50)   ,
sales_resource               varchar	(50)   ,
application_engineer         varchar	(50)   ,
region                       varchar	(50)   
);

-- temp table 
COPY tbl_company_info_temp (  
  company_code           ,  
company_number            ,
group_                    ,
company_scale             ,
deal_type                 ,
company_name              ,
company_name_eng          ,
business_registration_code,
establishment_date        ,
closure_date              ,
ceo_name                  ,
business_type             ,
business_item             ,
industry_type             ,
company_zip_code          ,
company_address           ,
company_phone_number      ,
company_fax_number        ,
homepage                  ,
memo                      ,
create_user               ,
create_date               ,
modify_date               ,
recent_user               ,
counter                   ,
account_code              ,
bank_name                 ,
account_owner             ,
sales_resource            ,
application_engineer      ,
region                    )
 FROM 'd:\company_info.csv' csv;

-- 헤더 정보 삭제 
delete from tbl_company_info_temp t 
where t.company_code = '﻿기업코드';

-- temp ->  본테이블로 이전
insert into tbl_company_info (  
company_code           ,  
company_number            ,
group_                    ,
company_scale             ,
deal_type                 ,
company_name              ,
company_name_eng          ,
business_registration_code,
establishment_date        ,
closure_date              ,
ceo_name                  ,
business_type             ,
business_item             ,
industry_type             ,
company_zip_code          ,
company_address           ,
company_phone_number      ,
company_fax_number        ,
homepage                  ,
memo                      ,
create_user               ,
create_date               ,
modify_date               ,
recent_user               ,
counter                   ,
account_code              ,
bank_name                 ,
account_owner             ,
sales_resource            ,
application_engineer      ,
region                   )
select   company_code           ,  
company_number            ,
group_                    ,
company_scale             ,
deal_type                 ,
company_name              ,
company_name_eng          ,
business_registration_code,
establishment_date::date        ,
closure_date::date              ,
ceo_name                  ,
business_type             ,
business_item             ,
industry_type             ,
company_zip_code          ,
company_address           ,
company_phone_number      ,
company_fax_number        ,
homepage                  ,
memo                      ,
create_user               ,
create_date::timestamp               ,
modify_date::timestamp               ,
recent_user               ,
counter::integer                   ,
account_code              ,
bank_name                 ,
account_owner             ,
sales_resource            ,
application_engineer      ,
region                   
from tbl_company_info_temp;

-- 데이터 확인 
select * from tbl_company_info;

-- temp table  삭제 
drop table if exists tbl_company_info_temp;

-- tbl_leads_info 
drop table if exists tbl_leads_info;
drop table if exists tbl_lead_info;

CREATE TABLE tbl_lead_info(                                             
lead_code              varchar(32)   PRIMARY KEY,
company_code            varchar(32)  not null,
lead_index             integer     ,
company_index           integer     ,
lead_number             varchar(50) ,
group_                  varchar(255),
sales_resource          varchar(50) ,
region                  varchar(50) ,
company_name            varchar(50) ,
company_zip_code        varchar(50) ,
company_address         varchar(50) ,
company_phone_number    varchar(100),
company_fax_number      varchar(100),
lead_name              varchar(50) ,
is_keyman               varchar(50) ,
department              varchar(50) ,
position                varchar(50) ,
mobile_number           varchar(50) ,
company_name_en         varchar(100),
email                   varchar(255),
homepage                varchar(255),
create_user             varchar(50) ,
create_date             timestamp	      ,
modify_date             timestamp	      ,
recent_user             varchar(50) ,
counter                 integer     ,
application_engineer    varchar(50) ,
status                  varchar(50)
);

CREATE TABLE tbl_lead_info_temp(                                             
lead_code              varchar(32)   ,
company_code            varchar(32)  ,
lead_index             varchar(10)     ,
company_index           varchar(10)      ,
lead_number             varchar(50) ,
group_                  varchar(255),
sales_resource          varchar(50) ,
region                  varchar(50) ,
company_name            varchar(50) ,
company_zip_code        varchar(50) ,
company_address         varchar(50) ,
company_phone_number    varchar(100),
company_fax_number      varchar(100),
lead_name              varchar(50) ,
is_keyman               varchar(50) ,
department              varchar(50) ,
position                varchar(50) ,
mobile_number           varchar(50) ,
company_name_en         varchar(100),
email                   varchar(255),
homepage                varchar(255),
create_user             varchar(50) ,
create_date             varchar(50)	      ,
modify_date             varchar(50)	      ,
recent_user             varchar(50) ,
counter                 varchar(50)     ,
application_engineer    varchar(50) ,
status                  varchar(50)
);

COPY tbl_lead_info_temp (  
  lead_code           ,
company_code        ,
lead_index         ,
company_index       ,
lead_number         ,
group_              ,
sales_resource      ,
region              ,
company_name        ,
company_zip_code    ,
company_address     ,
company_phone_number,
company_fax_number  ,
lead_name          ,
is_keyman           ,
department          ,
position            ,
mobile_number       ,
company_name_en     ,
email               ,
homepage            ,
create_user         ,
create_date         ,
modify_date         ,
recent_user         ,
counter             ,
application_engineer,
status              )
FROM 'd:\lead_info.csv' csv;

-- 헤더 정보 삭제 
delete from tbl_lead_info_temp t
where t.lead_code = '﻿거래처코드';

-- temp => 본테이블로 데이터 이전 
insert into tbl_lead_info(  lead_code           ,
company_code        ,
lead_index         ,
company_index       ,
lead_number         ,
group_              ,
sales_resource      ,
region              ,
company_name        ,
company_zip_code    ,
company_address     ,
company_phone_number,
company_fax_number  ,
lead_name          ,
is_keyman           ,
department          ,
position            ,
mobile_number       ,
company_name_en     ,
email               ,
homepage            ,
create_user         ,
create_date         ,
modify_date         ,
recent_user         ,
counter             ,
application_engineer,
status             )
select   lead_code           ,
company_code        ,
lead_index::integer         ,
company_index::integer       ,
lead_number         ,
group_              ,
sales_resource      ,
region              ,
company_name        ,
company_zip_code    ,
company_address     ,
company_phone_number,
company_fax_number  ,
lead_name          ,
is_keyman           ,
department          ,
position            ,
mobile_number       ,
company_name_en     ,
email               ,
homepage            ,
create_user         ,
create_date::timestamp         ,
modify_date::timestamp        ,
recent_user         ,
counter::integer             ,
application_engineer,
status              from tbl_lead_info_temp;

-- temp table 삭제 
drop table if exists tbl_lead_info_temp;


-- 사용자 Info Table 

drop table if exists tbl_user_info;

CREATE TABLE tbl_user_info (
  user_id varchar(50) PRIMARY KEY, 
  user_name varchar(50) not null, 
  password varchar(1000), 
  mobile_number varchar(50), 
  phone_number varchar(50), 
  department varchar(50), 
  position varchar(50), 
  email varchar(50), 
  group_ text, 
  memo text
  );

ALTER TABLE tbl_user_info ALTER COLUMN user_name SET NOT NULL;

copy tbl_user_info(
user_id,
user_name,
password,	
mobile_number,
phone_number,
department,
position,
email,
group_,
memo
)
FROM 'd:\user_info.csv' csv;

delete from tbl_user_info t
where t.user_id = '﻿user_id';

-- 일단 admin user 만 password demo로 변경 
		update tbl_user_info 
		set password = '$2b$10$p2rkmlGUUc/NvCIKeAQ7E.iQJ4gJEHelofarBvm/UROAu8lekcJUy'
		where user_id = 'admin';


-- log table 
drop table if exists tbl_logs; 

CREATE TABLE tbl_logs (
  log_id serial PRIMARY KEY,
  user_id varchar(50) , 
  table_name varchar(500),
  action_type varchar(100),
  parameter text,
  parameter_value text,
  creation_date timestamp
  );


-- uuid 설치 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- tbl_consulting_info 
drop table if exists tbl_consulting_info;

create table tbl_consulting_info(
consulting_code      varchar(32) PRIMARY KEY, 
lead_code            varchar(32) not null,
receipt_date         date       ,
receipt_time         varchar(50),
consulting_type      varchar(50),
receiver             varchar(50),
sales_representative varchar(50),
company_name         varchar(100),
company_code         varchar(32),
lead_name            varchar(50),
department           varchar(50),
position             varchar(50),
phone_number         varchar(100),
mobile_number        varchar(100),
email                varchar(200),
request_content      text        ,
status               varchar(50) ,
lead_time            varchar(50) ,
action_content       text        ,
request_type         varchar(50) ,
create_date          timestamp        ,
creater              varchar(50) ,
recent_user          varchar(50) ,
modify_date          timestamp        ,
product_type         varchar(50) 
);


-- 임시테이블 데이터 받기 위함 : 작업후 drop 필요 
create table tbl_consulting_temp(
consulting_code      varchar(32), 
lead_code            varchar(32),
receipt_date         varchar(32)       ,
receipt_time         varchar(50),
consulting_type      varchar(50),
receiver             varchar(50),
sales_representative varchar(50),
company_name         varchar(100),
company_code         varchar(32),
lead_name            varchar(50),
department           varchar(50),
position             varchar(50),
phone_number         varchar(100),
mobile_number        varchar(100),
email                varchar(200),
request_content      text        ,
status               varchar(50) ,
lead_time            varchar(50) ,
action_content       text        ,
request_type         varchar(50) ,
create_date          varchar(32)        ,
creater              varchar(50) ,
recent_user          varchar(50) ,
modify_date          varchar(50)  ,
product_type         varchar(50) 
);

copy tbl_consulting_temp(
consulting_code      , 
lead_code            ,
receipt_date                ,
receipt_time         ,
consulting_type      ,
receiver             ,
sales_representative ,
company_name         ,
company_code         ,
lead_name            ,
department           ,
position             ,
phone_number         ,
mobile_number        ,
email                ,
request_content       ,
status                ,
lead_time             ,
action_content        ,
request_type          ,
create_date                  ,
creater               ,
recent_user           ,
modify_date            ,
product_type          
)
FROM 'd:\tbl_consulting_info.csv' csv;

delete from tbl_consulting_temp t where t.consulting_code = '﻿식별코드';


insert into tbl_consulting_info
(consulting_code      , 
lead_code            ,
receipt_date                ,
receipt_time         ,
consulting_type      ,
receiver             ,
sales_representative ,
company_name         ,
company_code         ,
lead_name            ,
department           ,
position             ,
phone_number         ,
mobile_number        ,
email                ,
request_content       ,
status                ,
lead_time             ,
action_content        ,
request_type          ,
create_date                  ,
creater               ,
recent_user           ,
modify_date            ,
product_type          
)
select  
consulting_code      , 
lead_code            ,
substring(receipt_date,1,10)::date ,
receipt_time         ,
consulting_type      ,
receiver             ,
sales_representative ,
company_name         ,
company_code         ,
lead_name            ,
department           ,
position             ,
phone_number         ,
mobile_number        ,
email                ,
request_content       ,
status                ,
lead_time             ,
action_content        ,
request_type          ,
create_date::timestamp,
creater               ,
recent_user           ,
modify_date::timestamp ,
product_type          from tbl_consulting_temp;

-- 데이타 확인 
select * from tbl_consulting_info;

-- temp 테이블 삭제 
drop table if exists tbl_consulting_temp;



-- tbl_purchase_info
create table tbl_purchase_info(
purchase_code                 varchar(32) primary key,                    
company_code                  varchar(32) not null,
product_code                  varchar(32) ,
product_type                  varchar(100),
product_name                  varchar(255),
serial_number                 varchar(50) ,
delivery_date                 date        ,
MA_finish_date                date        ,
price                         numeric     ,
register                      varchar(30) ,
registration_date             timestamp   ,
recent_user                   varchar(30) ,
modify_date                   timestamp   ,
purchase_memo                 text        ,
status                        varchar(50) ,
quantity                      integer     ,
regcode                       varchar(50) ,
MA_contact_date               date        ,
currency                      varchar(10)
);

-- 임시테이블 데이터 받기 위함 . 작업 후 drop 필요 
create table tbl_purchase_info_temp(
purchase_code                 varchar(32) primary key,                    
company_code                  varchar(32) not null,
product_code                  varchar(32) ,
product_type                  varchar(100),
product_name                  varchar(255),
serial_number                 varchar(50) ,
delivery_date                 varchar(50)  ,
MA_finish_date                varchar(50)  ,
price                         varchar(50)  ,
register                      varchar(30) ,
registration_date             varchar(50)  ,
recent_user                   varchar(30) ,
modify_date                   varchar(50) ,
purchase_memo                 text        ,
status                        varchar(50) ,
quantity                      varchar(50)  ,
regcode                       varchar(50) ,
MA_contact_date               varchar(50)  ,
currency                      varchar(10)
);


copy tbl_purchase_info_temp(
purchase_code       ,                    
company_code        ,
product_code        ,
product_type        ,
product_name        ,
serial_number       ,
delivery_date        ,
MA_finish_date       ,
price                ,
register            ,
registration_date    ,
recent_user         ,
modify_date         ,
purchase_memo       ,
status              ,
quantity             ,
regcode             ,
MA_contact_date      ,
currency       
)
FROM 'd:\tbl_purchase_info.csv' csv;

delete from tbl_purchase_info_temp t
where t.purchase_code = '﻿Guid';

insert into tbl_purchase_info
(purchase_code       ,                    
company_code        ,
product_code        ,
product_type        ,
product_name        ,
serial_number       ,
delivery_date        ,
MA_finish_date       ,
price                ,
register            ,
registration_date    ,
recent_user         ,
modify_date         ,
purchase_memo       ,
status              ,
quantity             ,
regcode             ,
MA_contact_date      ,
currency       
)select 
purchase_code       ,                    
company_code        ,
product_code        ,
product_type        ,
product_name        ,
serial_number       ,
delivery_date::date       ,
MA_finish_date::date        ,
price::numeric                ,
register            ,
registration_date::timestamp    ,
recent_user         ,
modify_date::timestamp         ,
purchase_memo       ,
status              ,
quantity::integer             ,
regcode             ,
MA_contact_date::date      ,
currency       from  tbl_purchase_info_temp;

-- 데이타 확인 
select * from tbl_purchase_info;

-- temp 테이블 삭제 
drop table if exists tbl_purchase_info_temp;


-- tbl_transaction_info
drop table if exists tbl_transaction_info;

create table tbl_transaction_info(
transaction_code             varchar(32) primary key,
lead_code                 varchar(32) not null,
publish_type                 varchar(10) ,
transaction_type             varchar(10) ,
business_registration_code   varchar(50) ,
company_name                 varchar(50) ,
ceo_name                     varchar(50) ,
company_address              varchar(255),
business_type                varchar(100),
business_item                varchar(100),
publish_date                 date        ,
transaction_title            varchar(100),
supply_price                 numeric     ,
tax_price                    numeric     ,
total_price                  numeric     ,
payment_type                 varchar(20) ,
creater                      varchar(50) ,
modify_date                  timestamp   ,
recent_user                  varchar(50) ,
transaction_contents         text        ,
currency                     varchar(10) 
);

drop table if exists tbl_transaction_info_temp;

-- 임시테이블 데이터 받기 위함 . 작업 후 drop 필요 
create table tbl_transaction_info_temp(
transaction_code             varchar(32) primary key,
lead_code                 varchar(32) not null,
publish_type                 varchar(10) ,
transaction_type             varchar(10) ,
business_registration_code   varchar(50) ,
company_name                 varchar(50) ,
ceo_name                     varchar(50) ,
company_address              varchar(255),
business_type                varchar(100),
business_item                varchar(100),
publish_date                 varchar(100),
transaction_title            varchar(100),
supply_price                 varchar(100),
tax_price                    varchar(100),
total_price                  varchar(100),
payment_type                 varchar(20) ,
creater                      varchar(50) ,
modify_date                  varchar(100),
recent_user                  varchar(50) ,
transaction_contents         varchar(100),
currency                     varchar(10) 
);

copy tbl_transaction_info_temp(
  transaction_code          ,
  lead_code                 ,
  publish_type              ,
  transaction_type          ,
  business_registration_code,
  company_name              ,
  ceo_name                  ,
  company_address           ,
  business_type             ,
  business_item             ,
  publish_date              ,
  transaction_title         ,
  supply_price              ,
  tax_price                 ,
  total_price               ,
  payment_type              ,
  creater                   ,
  modify_date               ,
  recent_user               ,
  transaction_contents      ,
  currency                  
) FROM 'd:\tbl_transaction_info.csv' csv;

delete from tbl_transaction_info_temp t
where t.transaction_code = '﻿거래코드';

insert into tbl_transaction_info (
  transaction_code          ,
  lead_code                 ,
  publish_type              ,
  transaction_type          ,
  business_registration_code,
  company_name              ,
  ceo_name                  ,
  company_address           ,
  business_type             ,
  business_item             ,
  publish_date              ,
  transaction_title         ,
  supply_price              ,
  tax_price                 ,
  total_price               ,
  payment_type              ,
  creater                   ,
  modify_date               ,
  recent_user               ,
  transaction_contents      ,
  currency                  
) select 
 transaction_code          ,
  lead_code                 ,
  publish_type              ,
  transaction_type          ,
  business_registration_code,
  company_name              ,
  ceo_name                  ,
  company_address           ,
  business_type             ,
  business_item             ,
  publish_date::date              ,
  transaction_title         ,
  supply_price::numeric              ,
  tax_price::numeric                 ,
  total_price::numeric               ,
  payment_type              ,
  creater                   ,
  modify_date::timestamp               ,
  recent_user               ,
  transaction_contents      ,
  currency                  from tbl_transaction_info_temp;

-- 데이터 확인 
  select * from tbl_transaction_info;
  
-- temp table 삭제 
  drop table if exists tbl_transaction_info_temp;


-- 거래명세표_sub 데이터 import 
-- temp table 작성 
create table tbl_transaction_sub_temp (
    transaction_code	   varchar(100),
    month_day	           varchar(100),
    product_name	       varchar(100),
    standard	           varchar(100),
    unit	               varchar(100),
    quantity	           varchar(100),
    unit_price	         varchar(100),
    supply_price	       varchar(100),
    tax_price	           varchar(100),
    total_price	         varchar(100),
    memo	               varchar(100),
    transaction_sub_index varchar(100),
    lead_code	           varchar(100),
    company_name	       varchar(100),
    statement_number	   varchar(100),
    transaction_sub_type varchar(100),
    modify_date          varchar(100)
);

copy tbl_transaction_sub_temp(
    transaction_code	   ,
    month_day	           ,
    product_name	       ,
    standard	           ,
    unit	               ,
    quantity	           ,
    unit_price	         ,
    supply_price	       ,
    tax_price	           ,
    total_price	         ,
    memo	               ,
    transaction_sub_index ,
    lead_code	           ,
    company_name	       ,
    statement_number	   ,
    transaction_sub_type ,
    modify_date          
) from 'd:\tbl_transaction_info_sub.csv' csv;

delete from tbl_transaction_sub_temp t
where t.transaction_code = '﻿거래코드';

-- 프로시져 생성 p_insert_transaction_sub.sql 

-- 프로시져 실행
call p_insert_transaction_sub();

-- 데이터 확인 
select transaction_contents, * from tbl_transaction_info;

-- temp table 삭제 
drop table if exists tbl_transaction_sub_temp;

-- 프로시져 drop 
drop procedure p_insert_transaction_sub();

-- tbl_quotation_info

create table tbl_quotation_info(
quotation_code              varchar(32)   primary key,           
lead_code                   varchar(32)   not null  ,
region                      varchar(100)   ,
company_name                varchar(50)    ,
lead_name                   varchar(100)  ,
department                  varchar(50)    ,
position                    varchar(50)    ,
mobile_number               varchar(100)   ,
phone_number                varchar(100)   ,
fax_number                  varchar(100)   ,
email                       varchar(255)   ,
quotation_type              varchar(100)   ,
quotation_number            varchar(100)   ,
quotation_send_type         varchar(100)   ,
quotation_date              date         ,
delivery_location           varchar(100)   ,
payment_type                varchar(100)   ,
warranty_period             varchar(100)   ,
delivery_period             varchar(100)   ,
quotation_expiration_date   varchar(100)   ,
status                      varchar(100)   ,
comfirm_date                date           ,
quotation_manager           varchar(100)   ,
sales_representative        varchar(100)   ,
quotation_title             varchar(200)   ,
list_price                  numeric        ,
list_price_dc               numeric        ,
sub_total_amount            numeric        ,
dc_rate                     numeric        ,
dc_amount                   numeric        ,
quotation_amount            numeric        ,
tax_amount                  numeric        ,
total_quotation_amount      numeric        ,
cutoff_amount               numeric        ,
total_cost_price            numeric        ,
profit                      numeric        ,
profit_rate                 numeric        ,
upper_memo                  text           ,
lower_memo                  text           ,
count                       numeric        ,
creator                     varchar(100)   ,
create_date                 timestamp      ,
modify_date                 timestamp      ,
recent_user                 varchar(100)   ,
print_template              text           ,
quotation_table             text           ,
company_code                varchar(32),
currency                    varchar(10),
quotation_contents          text
);

-- temp table 생성
drop table if exists tbl_quotation_info_temp;

create table tbl_quotation_info_temp(
quotation_code              varchar(32)   ,           
lead_code                   varchar(32)    ,
region                      varchar(100)   ,
company_name                varchar(50)    ,
lead_name                   varchar(100)  ,
department                  varchar(50)    ,
position                    varchar(50)    ,
mobile_number               varchar(100)   ,
phone_number                varchar(100)   ,
fax_number                  varchar(100)   ,
email                       varchar(255)   ,
quotation_type              varchar(100)   ,
quotation_number            varchar(100)   ,
quotation_send_type         varchar(100)   ,
quotation_date              varchar(100)         ,
delivery_location           varchar(100)   ,
payment_type                varchar(100)   ,
warranty_period             varchar(100)   ,
delivery_period             varchar(100)   ,
quotation_expiration_date   varchar(100)   ,
status                      varchar(100)   ,
comfirm_date                varchar(100)           ,
quotation_manager           varchar(100)   ,
sales_representative        varchar(100)   ,
quotation_title             varchar(200)   ,
list_price                  varchar(100)        ,
list_price_dc               varchar(100)        ,
sub_total_amount            varchar(100)        ,
dc_rate                     varchar(100)        ,
dc_amount                   varchar(100)        ,
quotation_amount            varchar(100)        ,
tax_amount                  varchar(100)        ,
total_quotation_amount      varchar(100)        ,
cutoff_amount               varchar(100)        ,
total_cost_price            varchar(100)        ,
profit                      varchar(100)        ,
profit_rate                 varchar(100)        ,
upper_memo                  text           ,
lower_memo                  text           ,
count                       varchar(100)        ,
creator                     varchar(100)   ,
create_date                 varchar(100)      ,
modify_date                 varchar(100)      ,
recent_user                 varchar(100)   ,
print_template              text           ,
quotation_table             text           ,
company_code                varchar(32),
currency                    varchar(10)
);

-- temp 에 데이터 import 
copy tbl_quotation_info_temp (
quotation_code           ,
lead_code                ,
region                   ,
company_name             ,
lead_name                ,
department               ,
position                 ,
mobile_number            ,
phone_number             ,
fax_number               ,
email                    ,
quotation_type           ,
quotation_number         ,
quotation_send_type      ,
quotation_date           ,
delivery_location        ,
payment_type             ,
warranty_period          ,
delivery_period          ,
quotation_expiration_date,
status                   ,
comfirm_date             ,
quotation_manager        ,
sales_representative     ,
quotation_title          ,
list_price               ,
list_price_dc            ,
sub_total_amount         ,
dc_rate                  ,
dc_amount                ,
quotation_amount         ,
tax_amount               ,
total_quotation_amount   ,
cutoff_amount            ,
total_cost_price         ,
profit                   ,
profit_rate              ,
upper_memo               ,
lower_memo               ,
count                    ,
creator                  ,
create_date              ,
modify_date              ,
recent_user              ,
print_template           ,
quotation_table          ,
company_code             ,
currency                  
) from 'd:\tbl_quotation_info.csv' csv;

-- 헤더 정보 삭제 
delete from tbl_quotation_info_temp
where quotation_code = '﻿견적코드';



--본테이블로 데이터 insert 
insert into tbl_quotation_info
(quotation_code           ,
lead_code                ,
region                   ,
company_name             ,
lead_name                ,
department               ,
position                 ,
mobile_number            ,
phone_number             ,
fax_number               ,
email                    ,
quotation_type           ,
quotation_number         ,
quotation_send_type      ,
quotation_date           ,
delivery_location        ,
payment_type             ,
warranty_period          ,
delivery_period          ,
quotation_expiration_date,
status                   ,
comfirm_date             ,
quotation_manager        ,
sales_representative     ,
quotation_title          ,
list_price               ,
list_price_dc            ,
sub_total_amount         ,
dc_rate                  ,
dc_amount                ,
quotation_amount         ,
tax_amount               ,
total_quotation_amount   ,
cutoff_amount            ,
total_cost_price         ,
profit                   ,
profit_rate              ,
upper_memo               ,
lower_memo               ,
count                    ,
creator                  ,
create_date              ,
modify_date              ,
recent_user              ,
print_template           ,
quotation_table          ,
company_code             ,
currency)
select 
quotation_code           ,
lead_code                ,
region                   ,
company_name             ,
lead_name                ,
department               ,
position                 ,
mobile_number            ,
phone_number             ,
fax_number               ,
email                    ,
quotation_type           ,
quotation_number         ,
quotation_send_type      ,
quotation_date::date           ,
delivery_location        ,
payment_type             ,
warranty_period          ,
delivery_period          ,
quotation_expiration_date,
status                   ,
comfirm_date::date             ,
quotation_manager        ,
sales_representative     ,
quotation_title          ,
list_price::numeric               ,
list_price_dc::numeric            ,
sub_total_amount::numeric         ,
dc_rate::numeric                  ,
dc_amount::numeric                ,
quotation_amount::numeric         ,
tax_amount::numeric               ,
total_quotation_amount::numeric   ,
cutoff_amount::numeric            ,
total_cost_price::numeric         ,
profit::numeric                   ,
profit_rate::numeric              ,
upper_memo               ,
lower_memo               ,
count::numeric                    ,
creator                  ,
create_date::timestamp              ,
modify_date::timestamp              ,
recent_user              ,
print_template           ,
quotation_table          ,
company_code             ,
currency from tbl_quotation_info_temp;

-- 데이터 확인
select * from tbl_quotation_info;

-- temp table 삭제 
drop table if exists tbl_quotation_info_temp;


-- sub temp table 생성 
create table tbl_quotation_sub_info_temp(
  quotation_code	varchar(100),
  c_0	  varchar(100),
  c_1	  varchar(100),
  c_2	  varchar(100),
  c_3	  varchar(100),
  c_4	  varchar(100),
  c_5	  varchar(100),
  c_6	  varchar(100),
  c_7   varchar(100),
  c_8	  varchar(100),
  c_9	  varchar(100),
  c_10  varchar(100)	,
  c_11  varchar(100)	,
  c_12  varchar(100)	,
  c_13  varchar(100)	,
  c_14  varchar(100),
  c_15  varchar(100),
  c_16  varchar(100)	,
  c_17  varchar(100)	,
  c_18  varchar(100)	,
  c_19  varchar(100)	,
  c_20  varchar(100)	,
  c_21  varchar(100)	,
  c_22  varchar(100)	,
  c_23  varchar(100)	,
  c_24  varchar(100)	,
  c_25  varchar(100)	,
  c_998	varchar(4000),
  order_number varchar(100)
);


copy tbl_quotation_sub_info_temp 
(quotation_code,
  c_0	  ,
  c_1	  ,
  c_2	  ,
  c_3	  ,
  c_4	  ,
  c_5	  ,
  c_6	  ,
  c_7   ,
  c_8	  ,
  c_9	  ,
  c_10  	,
  c_11  	,
  c_12  	,
  c_13  	,
  c_14  ,
  c_15  ,
  c_16  	,
  c_17  	,
  c_18  	,
  c_19  	,
  c_20  	,
  c_21  	,
  c_22  	,
  c_23  	,
  c_24  	,
  c_25  	,
  c_998   ,
  order_number 
) from 'd:\tbl_quotation_sub_info.csv' csv;

  delete  from tbl_quotation_sub_info_temp t
  where t.quotation_code = '﻿견적코드';

-- procedure 생성 , p_insert_quotation_sub.sql 실행 

-- procedure 실행 
call p_insert_quotation_sub();

-- 데이터 확인  
select * from tbl_quotation_info;

-- temp table 삭제 
drop table if exists tbl_quotation_sub_info_temp;

-- 프로시져 drop 
drop procedure p_insert_quotation_sub();

-- sequence 하나 생성 필요 ,  데이터에 따라 start 숫자를 변경할 필요가 있어 보임.
drop sequence index_number_seq;
CREATE SEQUENCE index_number_seq START 20000;
-- 잘 나오는지 테스트 
select nextval('index_number_seq') ;


-- tbl_item_tag 테이블 생성 
create table tbl_item_tag(
  tag_code      varchar(32) primary key,   -- uuid
  tag_type      varchar(50),
  tag_name      varchar(100)
);

-- tbl_item_tag temp 생성 
create table tbl_item_tag_temp(
  tag_code      varchar(32),  -- 여긴 number
  tag_type      varchar(50),
  tag_name      varchar(100)
);

-- tbl_item_tag_temp import 
copy tbl_item_tag_temp(
  tag_code,
  tag_type, 
  tag_name 
) from 'd:\tbl_item_tag.csv' csv;

-- header 정보 삭제 
delete from tbl_item_tag_temp 
where tag_code = '﻿tag_code';

-- p_insert_item_tag.sql 생성 

-- p_insert_item_tag 프로시저 실행 
call p_insert_item_tag();

-- temp table tbl_item_tag_temp 삭제 
drop table if exists tbl_item_tag_temp;

-- 데이터 확인 
select * from tbl_item_tag;

-- purchase 테이블  2024.05.27

drop table if exists tbl_purchase_info;

CREATE TABLE tbl_purchase_info (
  purchase_code varchar(32) PRIMARY KEY , 
  company_code varchar(32), 
  product_code varchar(32), 
  product_class_name varchar(100), 
  product_name varchar(255), 
  serial_number varchar(50), 
  licence_Info varchar(50), 
  po_number varchar(50), 
  product_type varchar(50), 
  module varchar(50), 
  receipt_date date, 
  delivery_date date, 
  MA_finish_date date, 
  InvoiceNo varchar(50), 
  price numeric NULL, 
  register varchar(30),
  registration_date timestamp, 
  recent_user varchar(30), 
  modify_date timestamp, 
  purchase_memo text, 
  status varchar(50), 
  hq_finish_date date, 
  quantity integer, 
  regcode varchar(50), 
  MA_contact_date date);
  
  CREATE TABLE tbl_purchase_info_temp (
  purchase_code varchar(32), 
  company_code varchar(32), 
  product_code varchar(32), 
  product_class_name varchar(100), 
  product_name varchar(255), 
  serial_number varchar(50), 
  licence_Info varchar(50), 
  po_number varchar(50), 
  product_type varchar(50), 
  module varchar(50), 
  receipt_date varchar(50),  
  delivery_date varchar(50), 
  MA_finish_date varchar(50), 
  InvoiceNo varchar(50), 
  price varchar(50), 
  register varchar(30),
  registration_date varchar(50),  
  recent_user varchar(30), 
  modify_date varchar(50), 
  purchase_memo text, 
  status varchar(50), 
  hq_finish_date varchar(50), 
  quantity varchar(50), 
  regcode varchar(50), 
  MA_contact_date varchar(50)
);


copy tbl_purchase_info_temp
( purchase_code , 
  company_code , 
  product_code , 
  product_class_name, 
  product_name , 
  serial_number, 
  licence_Info , 
  po_number , 
  product_type , 
  module , 
  receipt_date ,  
  delivery_date , 
  MA_finish_date , 
  InvoiceNo , 
  price , 
  register ,
  registration_date ,  
  recent_user , 
  modify_date , 
  purchase_memo , 
  status , 
  hq_finish_date , 
  quantity , 
  regcode , 
  MA_contact_date )
from 'd:\tbl_purchase_info20240527.csv' csv;

-- 데이터 확인
select * from tbl_purchase_info_temp;

-- 헤더 삭제 
delete from tbl_purchase_info_temp 
where purchase_code = 'purchase_code';


insert into tbl_purchase_info (
  purchase_code , 
  company_code , 
  product_code , 
  product_class_name, 
  product_name , 
  serial_number, 
  licence_Info , 
  po_number , 
  product_type , 
  module , 
  receipt_date ,  
  delivery_date , 
  MA_finish_date , 
  InvoiceNo , 
  price , 
  register ,
  registration_date ,  
  recent_user , 
  modify_date , 
  purchase_memo, 
  status , 
  hq_finish_date , 
  quantity , 
  regcode , 
  MA_contact_date 
) select 
 purchase_code , 
  company_code , 
  product_code , 
  product_class_name, 
  product_name , 
  serial_number, 
  licence_Info , 
  po_number , 
  product_type , 
  module , 
  receipt_date::date ,  
  delivery_date::date , 
  MA_finish_date::date , 
  InvoiceNo , 
  price ::numeric, 
  register ,
  registration_date::timestamp ,  
  recent_user , 
  modify_date::timestamp , 
  purchase_memo, 
  status , 
  hq_finish_date::date , 
  quantity::integer , 
  regcode , 
  MA_contact_date::date  from tbl_purchase_info_temp;

drop table if exists tbl_purchase_info_temp;

select * from tbl_purchase_info ;

-- 5월 28일 tbl_MA_contract 

drop table if exists tbl_MA_contract;

CREATE TABLE tbl_MA_contract (
	guid varchar(32) not null PRIMARY KEY,
	purchase_code varchar(32) not null,
	MA_company_code varchar(32),
	MA_contract_date date,
	MA_finish_date date,
	MA_price numeric,
	MA_memo text,
	MA_register varchar(30),
	MA_registration_date timestamp,
	MA_recent_user varchar(30),
	MA_modify_date timestamp
);

create table tbl_MA_contract_temp (
	guid varchar(32) ,
	purchase_code varchar(32) ,
	MA_company_code varchar(32),
	MA_contract_date varchar(32),
	MA_finish_date varchar(32),
	MA_price varchar(32),
	MA_memo text,
	MA_register varchar(30),
	MA_registration_date varchar(32),
	MA_recent_user varchar(30),
	MA_modify_date varchar(32)
);

copy tbl_MA_contract_temp
( guid  ,
	purchase_code  ,
	MA_company_code ,
	MA_contract_date ,
	MA_finish_date ,
	MA_price ,
	MA_memo ,
	MA_register,
	MA_registration_date,
	MA_recent_user ,
	MA_modify_date )
from 'd:\tbl_MA_contract20240527.csv' csv;

-- 헤더 삭제 
delete from tbl_MA_contract_temp 
where guid = 'guid';

insert into tbl_MA_contract(
  guid  ,
	purchase_code  ,
	MA_company_code ,
	MA_contract_date ,
	MA_finish_date ,
	MA_price ,
	MA_memo ,
	MA_register,
	MA_registration_date,
	MA_recent_user ,
	MA_modify_date
)
select guid  ,
	purchase_code  ,
	MA_company_code ,
	MA_contract_date::date ,
	MA_finish_date::date ,
	MA_price::numeric ,
	MA_memo ,
	MA_register,
	MA_registration_date::timestamp,
	MA_recent_user ,
	MA_modify_date::timestamp 
  from tbl_MA_contract_temp;

  select * from tbl_MA_contract;

  drop table if exists tbl_MA_contract_temp;

  --품목관리 table : tbl_product_info : 2024.06.02 
 drop table if exists tbl_product_info;

 create table tbl_product_info
(product_code  varchar(32) not null PRIMARY KEY,
product_class_name  varchar(100), 
model_name     varchar(50),  
product_name   varchar(255), 
detail_desc    text, 
memo           text, 
creater        varchar(100), 
create_date    timestamp, 
modify_date    timestamp, 
recent_user    varchar(100)
);

create table tbl_product_info_temp
(product_code  varchar(32) ,
product_class_name  varchar(100), 
model_name     varchar(50),  
product_name   varchar(255), 
detail_desc    text, 
memo           text, 
creater        varchar(100), 
create_date    varchar(100), 
modify_date    varchar(100), 
recent_user    varchar(100)
);

copy tbl_product_info_temp(
product_code,
product_class_name,
model_name   ,
product_name ,
detail_desc  ,
memo         ,
creater      ,
create_date  ,
modify_date  ,
recent_user  
) from 'd:\tbl_product_info_202406020841.csv' csv;

-- 확인 
select * from tbl_product_info_temp;

-- 헤더 삭제 
delete from tbl_product_info_temp 
where product_code = '품목코드';

insert into tbl_product_info
(product_code,
product_class_name,
model_name   ,
product_name ,
detail_desc  ,
memo         ,
creater      ,
create_date  ,
modify_date  ,
recent_user  )
select product_code,
product_class_name,
model_name   ,
product_name ,
detail_desc  ,
memo         ,
creater      ,
create_date::timestamp  ,
modify_date::timestamp  ,
recent_user  from tbl_product_info_temp;

select * from tbl_product_info;

drop table tbl_product_info_temp;

-- 위까지  dev 적용 완료 (6/6)

-- purchase_info 새로 import 

delete from tbl_purchase_info;

drop table if exists tbl_purchase_info;

CREATE TABLE tbl_purchase_info (
  purchase_code varchar(32) PRIMARY KEY , 
  company_code varchar(32), 
  product_code varchar(32), 
  product_class_name varchar(100), 
  product_name varchar(255), 
  serial_number varchar(50), 
  licence_Info varchar(50), 
  po_number varchar(50), 
  product_type varchar(50), 
  module varchar(50), 
  receipt_date date, 
  delivery_date date, 
  MA_finish_date date, 
  InvoiceNo varchar(50), 
  price numeric NULL, 
  register varchar(30),
  registration_date timestamp, 
  recent_user varchar(30), 
  modify_date timestamp, 
  purchase_memo text, 
  status varchar(50), 
  hq_finish_date date, 
  quantity integer, 
  regcode varchar(50), 
  MA_contact_date date);
  

CREATE TABLE tbl_purchase_info_temp (
  purchase_code varchar(32), 
  company_code varchar(32), 
  product_code varchar(32), 
  product_class_name varchar(100), 
  product_name varchar(255), 
  serial_number varchar(50), 
  licence_Info varchar(50), 
  po_number varchar(50), 
  product_type varchar(50), 
  module varchar(50), 
  receipt_date varchar(50),  
  delivery_date varchar(50), 
  MA_finish_date varchar(50), 
  InvoiceNo varchar(50), 
  price varchar(50), 
  register varchar(30),
  registration_date varchar(50),  
  recent_user varchar(30), 
  modify_date varchar(50), 
  purchase_memo text, 
  status varchar(50), 
  hq_finish_date varchar(50), 
  quantity varchar(50), 
  regcode varchar(50), 
  MA_contact_date varchar(50)
);


copy tbl_purchase_info_temp
( purchase_code , 
  company_code , 
  product_code , 
  product_class_name, 
  product_name , 
  serial_number, 
  licence_Info , 
  po_number , 
  product_type , 
  module , 
  receipt_date ,  
  delivery_date , 
  MA_finish_date , 
  InvoiceNo , 
  price , 
  register ,
  registration_date ,  
  recent_user , 
  modify_date , 
  purchase_memo , 
  status , 
  hq_finish_date , 
  quantity , 
  regcode , 
  MA_contact_date )
from 'd:\tbl_purchase_info20240605.csv' csv;

-- 데이터 확인
select * from tbl_purchase_info_temp;

-- 헤더 삭제 
delete from tbl_purchase_info_temp 
where purchase_code = 'purchase_code';


insert into tbl_purchase_info (
  purchase_code , 
  company_code , 
  product_code , 
  product_class_name, 
  product_name , 
  serial_number, 
  licence_Info , 
  po_number , 
  product_type , 
  module , 
  receipt_date ,  
  delivery_date , 
  MA_finish_date , 
  InvoiceNo , 
  price , 
  register ,
  registration_date ,  
  recent_user , 
  modify_date , 
  purchase_memo, 
  status , 
  hq_finish_date , 
  quantity , 
  regcode , 
  MA_contact_date 
) select 
 purchase_code , 
  company_code , 
  product_code , 
  product_class_name, 
  product_name , 
  serial_number, 
  licence_Info , 
  po_number , 
  product_type , 
  module , 
  receipt_date::date ,  
  delivery_date::date , 
  MA_finish_date::date , 
  InvoiceNo , 
  price ::numeric, 
  register ,
  registration_date::timestamp ,  
  recent_user , 
  modify_date::timestamp , 
  purchase_memo, 
  status , 
  hq_finish_date::date , 
  quantity::integer , 
  regcode , 
  MA_contact_date::date  from tbl_purchase_info_temp;

  drop table tbl_purchase_info_temp;

  -- tbl_product_info : 다시 생성 
drop table tbl_product_info ;

create table tbl_product_info (
product_code      varchar(32) primary key,
product_class_name      varchar(100) not null,
manufacturer       varchar(100) not null,
model_name         varchar(100),
product_name       varchar(255),
unit               varchar(100),
cost_price         numeric     , 
reseller_price     numeric     ,
list_price         numeric     ,  
detail_desc        text        ,
memo               text        , 
creator            varchar(100),
create_date        timestamp   ,
modify_date        timestamp   ,
recent_user        varchar(100)
);

create table tbl_product_info_temp (
product_code      varchar(32) ,
product_class_name      varchar(100),
manufacturer       varchar(100),
model_name         varchar(100),
product_name       varchar(255),
unit               varchar(100),
cost_price         varchar(100),       
reseller_price     varchar(100),       
list_price         varchar(100),       
detail_desc        text        ,
memo               text        ,
creator            varchar(100),
create_date        varchar(100),   
modify_date        varchar(100),   
recent_user        varchar(100)
);

copy tbl_product_info_temp(
product_code  ,
product_class_name ,
manufacturer  ,
model_name    ,
product_name  ,
unit          ,
cost_price    ,
reseller_price,
list_price    ,
detail_desc   ,
memo          ,
creator       ,
create_date   ,
modify_date   ,
recent_user   
) from 'd:\tbl_product_info20240605.csv' csv;

delete from tbl_product_info_temp 
where product_code = 'product_code';

insert into tbl_product_info(
  product_code  ,
product_class_name ,
manufacturer  ,
model_name    ,
product_name  ,
unit          ,
cost_price    ,
reseller_price,
list_price    ,
detail_desc   ,
memo          ,
creator       ,
create_date   ,
modify_date   ,
recent_user   
) select 
product_code  ,
product_class_name ,
manufacturer  ,
model_name    ,
product_name  ,
unit          ,
cost_price::numeric    ,
reseller_price::numeric,
list_price::numeric    ,
detail_desc   ,
memo          ,
creator       ,
create_date::timestamp   ,
modify_date::timestamp   ,
recent_user   from tbl_product_info_temp;

drop table tbl_product_info_temp;

-- tbl_product_class_list 생성
drop table tbl_product_class_list;

create table tbl_product_class_list(
product_class_code   varchar(32) primary key,
product_class_name   VARCHAR(100) not null,
product_class_order  INTEGER,
memo  text);


create table tbl_product_class_list_temp(
product_class_code   VARCHAR(100),
product_class_name   VARCHAR(100),
product_class_order  VARCHAR(100),
memo   TEXT
);


 copy tbl_product_class_list_temp(
product_class_code  ,
product_class_name  ,
product_class_order ,
memo  
) from 'd:\tbl_product_class_list20240605.csv' csv;

delete from tbl_product_class_list_temp 
where product_class_code = 'product_class_code';

insert into tbl_product_class_list(
  product_class_code  ,
product_class_name  ,
product_class_order ,
memo   
) select 
 product_class_code  ,
product_class_name  ,
product_class_order::integer ,
memo   from tbl_product_class_list_temp;

select * from tbl_product_class_list;

drop table tbl_product_class_list_temp;


-- 2024.06.07 company info 다시 전체 로드 
drop table if exists tbl_company_info_temp;

create table tbl_company_info_temp
(company_code                 varchar	(32)   PRIMARY KEY,
company_number               varchar	(50)   ,
group_                        varchar	(255)  ,
company_scale                varchar	(100)  ,
deal_type                    varchar	(100)  ,
company_name                 varchar	(50)   ,
company_name_eng             varchar	(100)  ,
business_registration_code   varchar	(50)   ,
establishment_date           varchar	(50)	         ,
closure_date                 varchar	(50)	         ,
ceo_name                     varchar	(50)   ,
business_type                varchar	(100)  ,
business_item                varchar	(100)  ,
industry_type                varchar	(50)   ,
company_zip_code             varchar	(50)   ,
company_address              varchar	(255)  ,
company_phone_number         varchar	(50)   ,
company_fax_number           varchar	(50)   ,
homepage                     varchar	(255)  ,
memo                         text	         ,
create_user                  varchar	(50)   ,
create_date                  varchar	(50)	         ,
modify_date                  varchar	(50)	         ,
recent_user                  varchar	(50)   ,
counter                      varchar	(50)	     ,
account_code                 varchar	(50)   ,
bank_name                    varchar	(50)   ,
account_owner                varchar	(50)   ,
sales_resource               varchar	(50)   ,
application_engineer         varchar	(50)   ,
region                       varchar	(50)   
);


-- temp table 
COPY tbl_company_info_temp (  
  company_code           ,  
company_number            ,
group_                    ,
company_scale             ,
deal_type                 ,
company_name              ,
company_name_eng          ,
business_registration_code,
establishment_date        ,
closure_date              ,
ceo_name                  ,
business_type             ,
business_item             ,
industry_type             ,
company_zip_code          ,
company_address           ,
company_phone_number      ,
company_fax_number        ,
homepage                  ,
memo                      ,
create_user               ,
create_date               ,
modify_date               ,
recent_user               ,
counter                   ,
account_code              ,
bank_name                 ,
account_owner             ,
sales_resource            ,
application_engineer      ,
region                    )
 FROM 'd:\tbl_company_info20240607.csv' csv;

-- 헤더 삭제 
 delete from tbl_company_info_temp 
 where company_code = 'company_code';

-- 테이블 새로 생성 ; company_number not null 조건 삭제 
 drop table if exists tbl_company_info;

create table tbl_company_info
(company_code                 varchar	(32)   PRIMARY KEY,
company_number               varchar	(50)   ,
group_                        varchar	(255)  ,
company_scale                varchar	(100)  ,
deal_type                    varchar	(100)  ,
company_name                 varchar	(50)   ,
company_name_eng             varchar	(100)  ,
business_registration_code   varchar	(50)   ,
establishment_date           date	         ,
closure_date                 date	         ,
ceo_name                     varchar	(50)   ,
business_type                varchar	(100)  ,
business_item                varchar	(100)  ,
industry_type                varchar	(50)   ,
company_zip_code             varchar	(50)   ,
company_address              varchar	(255)  ,
company_phone_number         varchar	(50)   ,
company_fax_number           varchar	(50)   ,
homepage                     varchar	(255)  ,
memo                         text	         ,
create_user                  varchar	(50)   ,
create_date                  timestamp	         ,
modify_date                  timestamp	         ,
recent_user                  varchar	(50)   ,
counter                      integer	     ,
account_code                 varchar	(50)   ,
bank_name                    varchar	(50)   ,
account_owner                varchar	(50)   ,
sales_resource               varchar	(50)   ,
application_engineer         varchar	(50)   ,
region                       varchar	(50)   
);

 -- temp ->  본테이블로 이전
insert into tbl_company_info (  
company_code           ,  
company_number            ,
group_                    ,
company_scale             ,
deal_type                 ,
company_name              ,
company_name_eng          ,
business_registration_code,
establishment_date        ,
closure_date              ,
ceo_name                  ,
business_type             ,
business_item             ,
industry_type             ,
company_zip_code          ,
company_address           ,
company_phone_number      ,
company_fax_number        ,
homepage                  ,
memo                      ,
create_user               ,
create_date               ,
modify_date               ,
recent_user               ,
counter                   ,
account_code              ,
bank_name                 ,
account_owner             ,
sales_resource            ,
application_engineer      ,
region                   )
select   company_code     ,  
company_number            ,
group_                    ,
company_scale             ,
deal_type                 ,
company_name              ,
company_name_eng          ,
business_registration_code,
establishment_date::date  ,
closure_date::date        ,
ceo_name                  ,
business_type             ,
business_item             ,
industry_type             ,
company_zip_code          ,
company_address           ,
company_phone_number      ,
company_fax_number        ,
homepage                  ,
memo                      ,
create_user               ,
create_date::timestamp    ,
modify_date::timestamp    ,
recent_user               ,
counter::integer          ,
account_code              ,
bank_name                 ,
account_owner             ,
sales_resource            ,
application_engineer      ,
region                   
from tbl_company_info_temp;

drop table tbl_company_info_temp;

-- 위까지 6월 8일 dev 적용 

--6월 9일 tbl_user_info : l_job_type(SR/AE) 추가 , l_is_work 재직여부 추가 
ALTER TABLE tbl_user_info add  COLUMN l_job_type varchar(30);
ALTER TABLE tbl_user_info add  COLUMN l_is_work varchar(10);

update tbl_user_info
set l_is_work = 'N'
where user_name like '%퇴사자%';

update tbl_user_info
set l_is_work = 'Y'
where l_is_work is null;


WITH rows_to_update AS (
    SELECT user_id
    FROM tbl_user_info
    WHERE l_is_work = 'Y'
    LIMIT 14
)
UPDATE tbl_user_info
SET l_job_type = 'SR'
WHERE user_id IN (SELECT user_id FROM rows_to_update);

update tbl_user_info
set l_job_type = 'AE'
where l_job_type is null;


-- 6월 11일 tbl_lead_info 에 memo 추가 

ALTER TABLE tbl_lead_info add  COLUMN memo text;

-- 6월 14일 tbl_consulting_info 에 application_engineer  추가
alter table tbl_consulting_info add column application_engineer varchar(50);

-- 6월 14일 tbl_consulting_info 에 receipt_date를 timestamo로 변경 
alter table tbl_consulting_info add column receipt_date1 timestamp;

UPDATE tbl_consulting_info t
SET receipt_date1 = (
    SELECT 
        TO_TIMESTAMP(
            REPLACE(REPLACE(to_char(t2.receipt_date, 'YYYY-MM-DD') || ' ' || t2.receipt_time, '오전', 'AM'), '오후', 'PM'), 
            'YYYY-MM-DD AM HH12:MI:SS'
        )
    FROM tbl_consulting_info t2
    WHERE t2.consulting_code = t.consulting_code
);

update tbl_consulting_info
set receipt_date = null;

ALTER TABLE tbl_consulting_info ALTER COLUMN receipt_date TYPE timestamp;

update tbl_consulting_info 
set receipt_date = receipt_date1;

alter table tbl_consulting_info drop column receipt_date1;

alter table tbl_consulting_info drop column receipt_time;

select * from tbl_consulting_info;

-- 위까지 6월 17일 dev 적용 

-- 6월 19일 tbl_ma_contract table 재생성 MA_code, ma_type 추가 
drop table tbl_MA_contract; 

CREATE TABLE tbl_MA_contract (
MA_code varchar(32) PRIMARY KEY , 
purchase_code varchar(32) not null, 
MA_company_code varchar(32), 
MA_contract_date date, 
MA_finish_date date , 
MA_Type varchar(50), 
MA_price numeric,
MA_memo varchar(100),
MA_register varchar(30),
MA_registration_date timestamp,
MA_recent_user varchar(30), 
MA_modify_date timestamp);    

drop table if exists tbl_MA_contract_temp;

create table tbl_MA_contract_temp (
  MA_code varchar(32)  , 
purchase_code varchar(32) , 
MA_company_code varchar(32), 
MA_contract_date varchar(32), 
MA_finish_date varchar(32) , 
MA_Type varchar(50), 
MA_price varchar(32),
MA_memo varchar(100),
MA_register varchar(30),
MA_registration_date varchar(32),
MA_recent_user varchar(30), 
MA_modify_date varchar(32)
);

copy tbl_MA_contract_temp
( MA_code  ,
	purchase_code  ,
	MA_company_code ,
	MA_contract_date ,
	MA_finish_date ,
  MA_Type, 
	MA_price ,
	MA_memo ,
	MA_register,
	MA_registration_date,
	MA_recent_user ,
	MA_modify_date )
from 'd:\tbl_MA_contract202406190939.csv' csv;


-- 헤더 삭제 
delete from tbl_MA_contract_temp 
where MA_code = 'MA_code';

insert into tbl_MA_contract(
  MA_code  ,
	purchase_code  ,
	MA_company_code ,
	MA_contract_date ,
	MA_finish_date ,
  MA_Type,
	MA_price ,
	MA_memo ,
	MA_register,
	MA_registration_date,
	MA_recent_user ,
	MA_modify_date
)
select MA_code  ,
	purchase_code  ,
	MA_company_code ,
	MA_contract_date::date ,
	MA_finish_date::date ,
  MA_Type,
	MA_price::numeric ,
	MA_memo ,
	MA_register,
	MA_registration_date::timestamp,
	MA_recent_user ,
	MA_modify_date::timestamp 
  from tbl_MA_contract_temp;

  select * from tbl_MA_contract; -- 확인 


  drop table tbl_MA_contract_temp;  -- temp drop 

-- 2024.06.25 테이블 수정 , pk varchar32 -> 36 
ALTER TABLE tbl_company_info ALTER COLUMN company_code TYPE varchar(36);

ALTER TABLE tbl_lead_info ALTER COLUMN lead_code TYPE varchar(36);
ALTER TABLE tbl_lead_info ALTER COLUMN company_code TYPE varchar(36);


ALTER TABLE tbl_consulting_info ALTER COLUMN consulting_code TYPE varchar(36);
ALTER TABLE tbl_consulting_info ALTER COLUMN lead_code TYPE varchar(36);


ALTER TABLE tbl_purchase_info ALTER COLUMN purchase_code TYPE varchar(36);
ALTER TABLE tbl_purchase_info ALTER COLUMN company_code TYPE varchar(36);
ALTER TABLE tbl_purchase_info ALTER COLUMN product_code TYPE varchar(36);

-- 컬럼 이름 변경 : invoiceno invoice_number
ALTER TABLE tbl_purchase_info RENAME COLUMN invoiceno TO invoice_number; 



ALTER TABLE tbl_MA_contract ALTER COLUMN MA_code TYPE varchar(36);
ALTER TABLE tbl_MA_contract ALTER COLUMN purchase_code TYPE varchar(36);
ALTER TABLE tbl_MA_contract ALTER COLUMN MA_company_code TYPE varchar(36);


ALTER TABLE tbl_transaction_info ALTER COLUMN transaction_code TYPE varchar(36);
ALTER TABLE tbl_transaction_info ALTER COLUMN lead_code TYPE varchar(36);


ALTER TABLE tbl_quotation_info ALTER COLUMN quotation_code TYPE varchar(36);
ALTER TABLE tbl_quotation_info ALTER COLUMN lead_code TYPE varchar(36);


ALTER TABLE tbl_product_info ALTER COLUMN product_code TYPE varchar(36);


ALTER TABLE tbl_product_class_list ALTER COLUMN product_class_code TYPE varchar(36);

-- 2024.06.29 tbl_transaction_info lead_code => company_code 변경 

ALTER TABLE tbl_transaction_info RENAME COLUMN lead_code TO company_code;


-- 거래명세표_sub 데이터 import 
-- temp table 작성 

drop table if exists tbl_transaction_sub_temp;

create table tbl_transaction_sub_temp (
    transaction_code	   varchar(100),
    month_day	           varchar(100),
    product_name	       varchar(100),
    standard	           varchar(100),
    unit	               varchar(100),
    quantity	           varchar(100),
    unit_price	         varchar(100),
    supply_price	       varchar(100),
    tax_price	           varchar(100),
    total_price	         varchar(100),
    memo	               varchar(100),
    transaction_sub_index varchar(100),
    lead_code	           varchar(100),
    company_name	       varchar(100),
    statement_number	   varchar(100),
    transaction_sub_type varchar(100),
    modify_date          varchar(100)
);

copy tbl_transaction_sub_temp(
    transaction_code	   ,
    month_day	           ,
    product_name	       ,
    standard	           ,
    unit	               ,
    quantity	           ,
    unit_price	         ,
    supply_price	       ,
    tax_price	           ,
    total_price	         ,
    memo	               ,
    transaction_sub_index ,
    lead_code	           ,
    company_name	       ,
    statement_number	   ,
    transaction_sub_type ,
    modify_date          
) from 'd:\tbl_transaction_info_sub.csv' csv;

delete from tbl_transaction_sub_temp t
where t.transaction_code = '﻿거래코드';

-- 프로시져 생성 p_insert_transaction_sub.sql 

-- 프로시져 실행
call p_insert_transaction_sub();

-- 데이터 확인 
select transaction_contents, * from tbl_transaction_info;

-- temp table 삭제 
drop table if exists tbl_transaction_sub_temp;

-- 프로시져 drop 
drop procedure p_insert_transaction_sub();

-- 20204.06.30 dev 적용 여기까지 

-- 2024.06.30 tbl_product_class_list order 컬럼 변경 product_class_order

ALTER TABLE tbl_product_class_list RENAME COLUMN "order" TO product_class_order;

ALTER TABLE tbl_product_class_list RENAME COLUMN memo TO product_class_memo;

ALTER TABLE tbl_user_info RENAME COLUMN group_ TO private_group;


ALTER TABLE tbl_user_info RENAME COLUMN l_job_type TO job_type;
ALTER TABLE tbl_user_info RENAME COLUMN l_is_work  TO is_work;

alter table tbl_lead_info rename column leads_name to lead_name;  -- dev serv만 적용 local은 적용되어 있음
alter table tbl_lead_info rename column leads_index to lead_index;  -- dev serv만 적용 local은 적용되어 있음

-- 20204.06.30 dev 적용 여기까지 

-- 2024.07.01 tbl_user_info 의 password 컬럼 크기 늘림 : dev server 만 
alter table tbl_user_info ALTER COLUMN password TYPE varchar(1000);

-- 2024.07.06 tbl_user_info 
CREATE TABLE tbl_account_info (
accound_code                  VARCHAR(36) primary key, 
business_registration_code      VARCHAR(50),
company_name                    VARCHAR(100),
company_name_en                 VARCHAR(100),
ceo_name                        VARCHAR(255),
company_address                 VARCHAR(255),
company_zip_code                VARCHAR(50),
business_type                   VARCHAR(100),
business_item                   VARCHAR(100),
phone_number                    VARCHAR(100),
fax_number                      VARCHAR(100),
email                           VARCHAR(100),
homepage                        VARCHAR(100),
memo                            text	,
event                           text	
);

insert into tbl_account_info(
accound_code              ,
business_registration_code,
company_name              ,
company_name_en           ,
ceo_name                  ,
company_address           ,
company_zip_code          ,
business_type             ,
business_item             ,
phone_number              ,
fax_number                ,
email                     ,
homepage                  ,
memo                      ,
event                     )
values(
  '1',
'106-86-26016',
'노드데이타',
'Node Date Co. Ltd.',
'김신일',
'서울특별시 금천구 가산디지털 1로 128 1811 (STX V-Tower)',
'12034',
'도소매서비스',
'컴퓨터및주변기기,S/W개발,공급,자문',
'02-595-4450 / 051-517-445',
'02-595-4454 / 051-518-4452',
'sinil@nodedate.com',
'www.nodedata.com',
'',
''
);

-- 2024.07.10 tbl_company_info 테이블 변경 : 엑셀자료와 맞춤
alter  table tbl_company_info rename column group_ to company_group;
alter  table tbl_company_info rename column company_name_eng to company_name_en;

-- 2024.07.18 compnay_info table 수정 

alter table tbl_lead_info rename column group_ to lead_group;

alter table tbl_lead_info add column deal_type varchar(50);

alter table tbl_consulting_info rename column creater to creator;

--이미 company_code 이면 수행 필요 없음
alter table tbl_transaction_info rename column lead_code to company_code;

alter table tbl_transaction_info rename column creater to creator;

alter table tbl_transaction_info drop column currency;

alter table tbl_transaction_info add column paid_money numeric;
alter table tbl_transaction_info add column bank_name varchar(50);
alter table tbl_transaction_info add column account_owner varchar(50);
alter table tbl_transaction_info add column account_number varchar(50);
alter table tbl_transaction_info add column card_name varchar(50);
alter table tbl_transaction_info add column card_number varchar(50);
alter table tbl_transaction_info add column is_bill_publish varchar(100);


alter table tbl_product_info rename column product_class to product_class_name;

-- 2024.07.19 
alter table tbl_lead_info drop column lead_number;
alter table tbl_lead_info add column memo text;

alter table tbl_quotation_info drop column currency;

alter table tbl_quotation_info add column quotation_contents text;

-- 2024.08.02 세금계산서 테이블 추가 , list_collection 추가 
drop table if exists  tbl_tax_invoice;

create table tbl_tax_invoice  (              
tax_invoice_code              varchar(36) primary key , 
company_code                     varchar(36),  
publish_type                  varchar(10), 
transaction_type              varchar(10), 
invoice_type                  varchar(10), 
index1                        integer    ,
index2                        integer    ,
business_registration_code    varchar(50), 
company_name                  varchar(50),
ceo_name                      varchar(50), 
company_address               varchar(100),
business_type                 varchar(50), 
business_item                 varchar(50),
create_date                   timestamp  , 
supply_price                  numeric    ,
tax_price                     numeric    , 
total_price                   numeric    , 
cash_amount                   numeric    , 
check_amount                  numeric    , 
note_amount                   numeric    , 
receivable_amount             numeric    , 
receive_type                  varchar(10), 
memo                          varchar(50), 
summary                       varchar(50), 
invoice_contents              text       ,                            
modify_date                   timestamp  ,
creator                       varchar(50),  
recent_user                   varchar(50)  );


drop table if exists  tbl_list_collection;

create table tbl_list_collection(
list_name VARCHAR(255) not null,
	list_item_code  varchar(36) primary key,
	list_item_value VARCHAR(255),
	list_item_order numeric,
	list_item_memo TEXT);

  -- 2024.08.06  tax table 변경 
  alter table tbl_tax_invoice drop column lead_code; 
  alter table tbl_tax_invoice add column company_code varchar(36); 

-- 2024.08.10 nodemailer 설치  : node 버전 올림. s
npm install nodemailer

nvm install 20.3.0

nvm use 20.3.0

npm install sharp --ignore-scripts

-- 2024.08.13 : 임시 문제 해결 tbl_transaction_info
update tbl_transaction_info
set transaction_contents = 
(select transaction_contents 
       from tbl_transaction_info 
       where modify_date = (select max(modify_date)
                               from tbl_transaction_info 
                               where transaction_contents is not null
                               limit 1) ) ;

-- 2024.08.22 : sequence_number 추가 
alter table tbl_tax_invoice add column sequence_number varchar(50);

-- 2024.08.26 
alter table tbl_product_info RENAME COLUMN  product_class to product_class_name;

alter table tbl_quotation_info add column quotation_contents text;

--2024.09.03 
alter table  tbl_consulting_info ALTER COLUMN modify_date TYPE timestamp;

--2024.09.05
alter table tbl_tax_invoice rename column lead_code to company_code; 
alter table tbl_tax_invoice add column invoice_contents text;

-- 2024.09.07
alter table tbl_company_info add column site_id varchar(50);
--2024.09.08 
alter table tbl_lead_info add column email2 varchar(255);

--2024.09.20 
CREATE SEQUENCE quotation_reset_seq START 1;

--2024.09.24
nvm install 20.5.0
nvm use 20.5.0

--2024.09.25
alter table tbl_consulting_info add column request_attachment_code varchar(36);
alter table tbl_consulting_info add column action_attachment_code varchar(36);

-- 2024.09.26 
create table tbl_attachment_info
(       
UUID             varchar(36) primary key,
attachment_code  varchar(36)  not null,
dir_name         varchar(256) not null,
file_name        varchar(256),
file_ext         varchar(16) ,
attachment_index  integer,
create_date                   timestamp ,
creator                       varchar(50) 
);

--2024.10.05 , 관리자 여부 추가
alter table tbl_user_info add user_role varchar(10);

--2024.11.13 , tbl_consulting_info memo 추가 
alter table tbl_consulting_info add memo text;

--2024.11.20 , tbl_account_info 오류 수정 
alter table tbl_account_info rename column accound_code to account_code;