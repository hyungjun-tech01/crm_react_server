CREATE OR REPLACE PROCEDURE p_insert_quotation_sub()
LANGUAGE plpgsql
AS $$
DECLARE
    v_quotation_sub text;
    vv_quotation_sub text;
    TARGET_CURSOR record;   -- 커서를 선언 해 주어야 한다. 
BEGIN
    FOR TARGET_CURSOR IN
        SELECT  quotation_code
          FROM  tbl_quotation_info  -- 여기에 ; 세미콜론이 없어야 한다. 
    LOOP
        select array_to_json(array(
	        select row_to_json(tmp) 
	        from(
                select	quotation_code,
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
                from	tbl_quotation_sub_info_temp 
	        	where quotation_code = TARGET_CURSOR.quotation_code
	        ) as tmp
        ) ) into v_quotation_sub;

        select regexp_replace(v_quotation_sub, 'c_+', '', 'g' ) into vv_quotation_sub;

        update tbl_quotation_info 
        set quotation_contents = vv_quotation_sub
        where quotation_code = TARGET_CURSOR.quotation_code;
    END LOOP;

END;
$$;

