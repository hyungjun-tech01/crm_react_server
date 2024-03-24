CREATE OR REPLACE PROCEDURE p_insert_transaction_sub()
LANGUAGE plpgsql
AS $$
DECLARE
    v_transaction_sub text;
    TARGET_CURSOR record;   -- 커서를 선언 해 주어야 한다. 
BEGIN
    FOR TARGET_CURSOR IN
        SELECT  transaction_code
          FROM  tbl_transaction_info  -- 여기에 ; 세미콜론이 없어야 한다. 
    LOOP
        select array_to_json(array(
	        select row_to_json(tmp) 
	        from(
                select	 transaction_code	   ,
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
            	trasaction_sub_index ,
            	lead_code	           ,
            	company_name	       ,
            	statement_number	   ,
            	transaction_sub_type ,
            	modify_date          
                from	tbl_transaction_sub_temp 
	        	where transaction_code = TARGET_CURSOR.transaction_code
	        ) as tmp
        ) ) into v_transaction_sub;

        update tbl_transaction_info 
        set transaction_contents = v_transaction_sub
        where transaction_code = TARGET_CURSOR.transaction_code;
    END LOOP;

END;
$$;

