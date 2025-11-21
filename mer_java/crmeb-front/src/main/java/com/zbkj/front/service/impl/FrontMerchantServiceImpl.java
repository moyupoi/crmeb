package com.zbkj.front.service.impl;

import com.zbkj.front.service.FrontMerchantService;
import com.zbkj.service.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 类的详细说明
 *
 * @author Han
 * @version 1.0.0
 * @Date 2025/8/21
 */
@Service
public class FrontMerchantServiceImpl implements FrontMerchantService {

    @Autowired
    private MerchantService merchantService;

}
