-- 기업관리 테이블 

drop table tbl_company_info;

create table tbl_company_info
(company_code                 varchar	(32)   PRIMARY KEY,
company_number               varchar	(50)   not null,
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
drop table tbl_company_info_temp;

-- tbl_leads_info 
drop table tbl_leads_info;
drop table tbl_lead_info;

CREATE TABLE tbl_lead_info(                                             
lead_code              varchar(32)   PRIMARY KEY,
company_code            varchar(32)  not null,
leads_index             integer     ,
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
leads_name              varchar(50) ,
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
leads_index             varchar(10)     ,
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
leads_name              varchar(50) ,
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
leads_index         ,
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
leads_name          ,
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

insert into tbl_lead_info(  lead_code           ,
company_code        ,
leads_index         ,
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
leads_name          ,
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
leads_index::integer         ,
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
leads_name          ,
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

-- 데이터 확인 

select * from tbl_lead_info;

drop table tbl_lead_info_temp;


drop table invoce; 
drop table company;
drop table lead;

-- 사용자 Info Table 

drop table tbl_user_info;

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
		update tbl_user_info t 
		set t.password = '$2b$10$p2rkmlGUUc/NvCIKeAQ7E.iQJ4gJEHelofarBvm/UROAu8lekcJUy'
		where t.user_id = 'admin';


-- log table 
drop table tbl_logs; 

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
drop table tbl_consulting_info;

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
create_date          date        ,
creater              varchar(50) ,
recent_user          varchar(50) ,
modify_date          date        ,
product_type         varchar(50) 
);

ALTER TABLE tbl_consulting_info ALTER COLUMN lead_code SET NOT NULL;

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
substring(create_date,1,10)::date  ,
creater               ,
recent_user           ,
substring(modify_date,1,10)::date            ,
product_type          from tbl_consulting_temp;

drop table tbl_consulting_temp;


-- tbl_purchase_info
create table tbl_purchase_info(
purchase_code                 varchar(32) ,                    
company_code                  varchar(32) ,
product_code                  varchar(32) ,
product_type                  varchar(100),
product_name                  varchar(255),
serial_number                 varchar(50) ,
delivery_date                 date            ,
MA_finish_date                date            ,
price                         float          ,
register                      varchar(30) ,
registration_date             date            ,
recent_user                   varchar(30) ,
modify_date                   date            ,
purchase_memo                 text            ,
status                        varchar(50) ,
quantity                      integer         ,
regcode                       varchar(50) ,
MA_contact_date               date            ,
currency                      varchar(10)  default 'KRW'
)
