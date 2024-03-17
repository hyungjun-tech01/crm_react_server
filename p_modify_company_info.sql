DROP PROCEDURE IF EXISTS p_modify_company_info;


CREATE OR REPLACE PROCEDURE p_modify_company_info(
i_action_type                in text,   -- 'ADD', 'UPDATE'
i_company_code               in text,   -- ADD일때는 들어오면 안되고, UPDATE일때는 반드시 들어와야
i_company_number             in text, 
i_group_                     in text,
i_company_scale              in text,
i_deal_type                  in text,
i_company_name               in text,
i_company_name_eng           in text,
i_business_registration_code in text,
i_establishment_date         in text,
i_closure_date               in text,
i_ceo_name                   in text,
i_business_type              in text,
i_business_item              in text,
i_industry_type              in text,
i_company_zip_code           in text,
i_company_address            in text,
i_company_phone_number       in text,
i_company_fax_number         in text,
i_homepage                   in text,
i_memo                       in text,
i_modify_user                in text,
i_counter                    in integer,
i_account_code               in text,
i_bank_name                  in text,
i_account_owner              in text,
i_sales_resource             in text,
i_application_engineer       in text,
i_region                     in text,   
x_company_code              out text,
x_create_user               out text,
x_create_date               out text,
x_modify_date               out text,
x_recent_user               out text
 )
LANGUAGE plpgsql
AS $$
DECLARE
    v_uuid_company_code text;
    v_company_code text;
    v_current_date date; 
BEGIN
   
--select COALESCE(regexp_replace(i_card_name, '[\n\r]+', ' ', 'g' ), ' ')
-- into v_card_name;

  select now() into v_current_date;

    -- company 추가 
  if(i_action_type = 'ADD') then  
      -- company code 생성 
    SELECT uuid_generate_v4() into v_uuid_company_code;
    select upper(regexp_replace(v_uuid_company_code, '[-]','','g')) into v_company_code;


      

    insert into tbl_company_info(
        company_code                   ,
        company_number                 ,
        group_                         ,
        company_scale                  ,
        deal_type                      ,
        company_name                   ,
        company_name_eng               ,
        business_registration_code     ,
        establishment_date             ,
        closure_date                   ,
        ceo_name                       ,
        business_type                  ,
        business_item                  ,
        industry_type                  ,
        company_zip_code               ,
        company_address                ,
        company_phone_number           ,
        company_fax_number             ,
        homepage                       ,
        memo                           ,
        create_user                    ,
        create_date                    ,
        modify_date                    ,
        recent_user                    ,
        counter                        ,
        account_code                   ,
        bank_name                      ,
        account_owner                  ,
        sales_resource                 ,
        application_engineer           ,
        region                         )
    values(
        v_company_code              ,
        i_company_number            , 
        i_group_                    ,
        i_company_scale             ,
        i_deal_type                 ,
        i_company_name              ,
        i_company_name_eng          ,
        i_business_registration_code,
        i_establishment_date::date  ,
        i_closure_date ::date       ,
        i_ceo_name                  ,
        i_business_type             ,
        i_business_item             ,
        i_industry_type             ,
        i_company_zip_code          ,
        i_company_address           ,
        i_company_phone_number      ,
        i_company_fax_number        ,
        i_homepage                  ,
        i_memo                      ,
        i_modify_user               ,        
        now()                       ,
        now()                       ,
        i_modify_user               ,
        i_counter                   ,
        i_account_code              ,
        i_bank_name                 ,
        i_account_owner             ,
        i_sales_resource            ,
        i_application_engineer      ,
        i_region                    );

    elsif(i_action_type = 'UPDATE') then      

       update tbl_company_info
       set company_number =  COALESCE(i_company_number ,company_number) ,
           group_ =  COALESCE(i_group_, group_)  ,
           company_scale =  COALESCE(i_company_scale, company_scale)  ,
           deal_type  =  COALESCE(i_deal_type, deal_type) ,
           company_name  =  COALESCE(i_company_name, company_name) ,
           company_name_eng  =  COALESCE(i_company_name_eng, company_name_eng) ,
           business_registration_code  =  COALESCE(i_business_registration_code, business_registration_code),
           establishment_date =  COALESCE(i_establishment_date::date,establishment_date::date) ,
           closure_date  =  COALESCE( i_closure_date::date, closure_date::date) ,
           ceo_name  =  COALESCE( i_ceo_name, ceo_name)  ,
           business_type  =  COALESCE( i_business_type, business_type) ,
           business_item  =  COALESCE( i_business_item, business_item) ,
           industry_type  =  COALESCE( i_industry_type, industry_type) ,
           company_zip_code  =  COALESCE( i_company_zip_code, company_zip_code) ,
           company_address  =  COALESCE( i_company_address, company_address) ,
           company_phone_number =  COALESCE( i_company_phone_number, company_phone_number) ,
           company_fax_number   =  COALESCE( i_company_fax_number, company_fax_number),
           homepage             =  COALESCE( i_homepage, homepage) ,
           memo                 =  COALESCE( i_memo, memo) ,
           modify_date          = now()          ,
           recent_user          = i_modify_user          ,
           account_code         =  COALESCE( i_account_code, account_code)         ,
           bank_name            =  COALESCE( i_bank_name, bank_name)         ,
           account_owner        =  COALESCE( i_account_owner, account_owner)         ,
           sales_resource       =  COALESCE( i_sales_resource, sales_resource)        ,
           application_engineer   =  COALESCE(i_application_engineer, application_engineer)        ,
           region                 =  COALESCE( i_region, region)       
       where company_code = i_company_code;

       if i_counter != 0 then
          update tbl_company_info
          set counter = i_counter
          where company_code = i_company_code;
       end if;

    end if;
    
    -- 
    -- log 생성 
	insert into tbl_logs(user_id, table_name, action_type, parameter, parameter_value, creation_date)
	values(i_modify_user, 'tbl_company_info', i_action_type, 
  'company_code,company_number,group_,company_scale,deal_type,company_name,company_name_eng,
business_registration_code,establishment_date,closure_date,ceo_name,business_type,business_item,
industry_type,company_zip_code,company_address,company_phone_number,company_fax_number,homepage,
memo,counter,account_code,bank_name,account_owner,sales_resource,application_engineer,region' ,
v_company_code||','||i_company_number||','||i_group_||','||i_company_scale||','||i_deal_type||','||
i_company_name||','||i_company_name_eng||','||i_business_registration_code||','||COALESCE(i_establishment_date,'')||','||
COALESCE(i_closure_date,'')||','||i_ceo_name||','||i_business_type||','||i_business_item||','||i_industry_type||','||
i_company_zip_code||','||i_company_address||','||i_company_phone_number||','||i_company_fax_number||','||
i_homepage||','||i_memo||','||i_counter||','||i_account_code||','||i_bank_name||','||i_account_owner||','||
i_sales_resource||','||i_application_engineer||','||i_region, now());

-- out parameter 
if( i_action_type = 'ADD') then
  x_company_code := v_company_code; 
  x_create_user  := i_modify_user;
  x_create_date     := v_current_date::text; 
  x_modify_date     := v_current_date::text; 
  x_recent_user     := i_modify_user;
elsif(i_action_type = 'UPDATE') then
  x_company_code := i_company_code; 
  x_modify_date     := v_current_date::text; 
  x_recent_user     := i_modify_user;
end if;

END;
$$;

-- call procedure create company
call p_modify_company_info(
'ADD',  -- i_action_type                in text,   -- 'ADD', 'UPDATE'
'',
'10', -- i_company_number             in text, 
'공유그룹/기타;' , -- i_group_                     in text,
'대기업', -- i_company_scale              in text,
'매출', -- i_deal_type                  in text,
'테슽라', --                in text,
'Tesla', --            in text,
'391-81-00905', -- i_business_registration_code in text,
'2016.01.01', -- i_establishment_date         in text,
null,  -- i_closure_date               in text,
'일론머스크', -- i_ceo_name                   in text,
'제조업 외', -- i_business_type              in text,
'자동차, 통신, 신재생에너지설비 외', -- i_business_item              in text,
'A급', -- i_industry_type              in text,
'12345', -- i_company_zip_code           in text,
'서울특별시 금천구 디지털로9길 47 한신IT타워 2차 304-1', -- i_company_address            in text,
'02-499-9998', -- i_company_phone_number       in text,
'055-333-7982', -- i_company_fax_number         in text,
'http://fablast.com/', -- i_homepage                   in text,
'24.02.14 MKT 리드/3개 업체 비교 견적 중 >> OCT 리스트 확인 됨', -- i_memo                       in text,
'admin', -- i_modify_user                in text,
10000, -- i_counter                    in text,
'551101-01-279278', -- i_account_code               in text,
'국민은행', -- i_bank_name                  in text,
'여혜란(대신테크)', -- i_account_owner              in text,
'이도녕', -- i_sales_resource             in text,
'' , --        in text,
'경기 남부', --                      in text,   
'', -- x_company_code              out text,
'', -- x_create_user               out text,
'', -- x_create_date               out text,
'', -- x_modify_date               out text,
'');


-- call procedure update company
call p_modify_company_info(
'UPDATE',  -- i_action_type                in text,   -- 'ADD', 'UPDATE'
'8EFD598A6A26FF4E9D55900D4CDF8749',
'10', -- i_company_number             in text, 
'공유그룹/기타;' , -- i_group_                     in text,
'대기업', -- i_company_scale              in text,
'매출', -- i_deal_type                  in text,
'테슽라', --                in text,
'Tesla', --            in text,
'391-81-00905', -- i_business_registration_code in text,
'2016.01.01', -- i_establishment_date         in text,
null,  -- i_closure_date               in text,
'일론머스크', -- i_ceo_name                   in text,
'제조업 외', -- i_business_type              in text,
'자동차, 통신, 신재생에너지설비 외', -- i_business_item              in text,
'A급', -- i_industry_type              in text,
'12345', -- i_company_zip_code           in text,
'서울특별시 금천구 디지털로9길 47 한신IT타워 2차 304-1', -- i_company_address            in text,
'02-499-9998', -- i_company_phone_number       in text,
'055-333-7982', -- i_company_fax_number         in text,
'http://fablast.com/', -- i_homepage                   in text,
'24.02.14 MKT 리드/3개 업체 비교 견적 중 >> OCT 리스트 확인 됨', -- i_memo                       in text,
'admin', -- i_modify_user                in text,
10000, -- i_counter                    in text,
'551101-01-279278', -- i_account_code               in text,
'국민은행', -- i_bank_name                  in text,
'여혜란(대신테크)', -- i_account_owner              in text,
'이도녕', -- i_sales_resource             in text,
'' , --        in text,
'경기 남부', --                      in text,   
'', -- x_company_code              out text,
'', -- x_create_user               out text,
'', -- x_create_date               out text,
'', -- x_modify_date               out text,
'');