-- 기업관리 테이블 

drop table tbl_company_info;

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
create_date                  date	         ,
modify_date                  date	         ,
recent_user                  varchar	(50)   ,
counter                      integer	     ,
account_code                 varchar	(50)   ,
bank_name                    varchar	(50)   ,
account_owner                varchar	(50)   ,
sales_resource               varchar	(50)   ,
application_engineer         varchar	(50)   ,
region                       varchar	(50)   
);

COPY tbl_company_info (  company_code,
company_number,
group_,
company_scale,
deal_type,
company_name,
company_name_eng,
business_registration_code,
ceo_name,
business_type,
business_item,
industry_type,
company_zip_code,
company_address,
company_phone_number,
company_fax_number,
homepage,
memo,
create_user,
recent_user,
account_code,
bank_name,
account_owner,
sales_resource,
application_engineer,
region)
 FROM 'd:\company_info.csv' csv;



drop table tbl_leads_info;

CREATE TABLE tbl_leads_info(                                             
 leads_code              varchar(32)   PRIMARY KEY,
company_code            varchar(32) ,
leads_index             integer     ,
company_index           integer     ,
deal_type               varchar(50) ,
group_                   varchar(255),
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
create_date             date	      ,
modify_date             date	      ,
recent_user             varchar(50) ,
counter                 integer     ,
application_engineer    varchar(50) ,
status                  varchar(50)
);


  drop table invoce; 

CREATE TABLE invoice(
	invoice_id  serial PRIMARY KEY,         -- 거래명세표코드
	customer_id varchar(32) ,              -- 거래처코드
	class_issue varchar(10) ,              -- 발행구분
	class_ varchar(10) ,                 -- [구분]
	book integer ,                      -- [권] 
	item integer ,                      -- [호] [int] ,
	invoice_number varchar(50) ,     -- [일련번호] 
	Transaction_classification varchar(50) ,   -- [거래구분] 
	Business_number varchar(50) ,    -- [사업자번호]
	company_name varchar(50) ,       -- [상호]
	name varchar(50) ,               -- [성명]
	business_address varchar(255) ,  -- [사업장주소] 
 	state_business varchar(100) ,    -- [업태] [n
	type_ varchar(100) ,             -- [종목] [n
	issue_date date ,                -- [발행일자] [
	transaction_content varchar(100) ,  -- [거래내용]
	supply_amount float ,               -- [공급가액]
	tax_amount float ,                  -- [세액]
	total_amount float ,               -- [합계금액] [
	in_out_amount float  ,              -- [입출금액] 
	accounts_receivable float ,         -- [미수금]
	payment_type varchar(20) ,         -- [결제유형] [n
	memo text ,                        -- [비고]
	bank_name  varchar(50) ,           --[은행명]
	account_holder varchar(50) ,       -- [예금주]
	bank_account varchar(50) ,         -- [계좌번호] [n
	card_name varchar(50) ,            -- [카드명] [n
	card_number varchar(50) ,          -- [카드번호] [n
	in_out_code varchar(32) ,          -- [입출코드] [n
	transaction_code varchar(32) ,     -- [출납코드] [n
	created_by varchar(50) ,           -- [작성자] [n
	last_update_date date ,            -- [수정일자] [
	last_updated_by varchar(50) ,      -- [최근사용자] [n
	n_add integer ,                    -- [N추가] [int]
	field01 varchar(100) ,
	field02 varchar(100) ,
	field03 varchar(100) ,
	field04 varchar(100) ,
	field05 varchar(100) ,
	field06 float ,
	field07 float ,
	field08 float ,
	field09 text ,
	field10 text ,
	field11 text ,
	field12 float ,
	field13 float ,
	field14 float ,
	field15 date ,
	field16 date ,
	field17 date 
);


-- 사용자 Info Table 

drop table tbl_user_info;

CREATE TABLE tbl_user_info (
  user_id varchar(50) PRIMARY KEY, 
  user_name varchar(50), 
  password varchar(50), 
  mobile_number varchar(50), 
  phone_number varchar(50), 
  department varchar(50), 
  position varchar(50), 
  email varchar(50), 
  group text, 
  memo text, 
  );
