package com.controleproject.config;

import com.controleproject.proxy.TransactionProxy;
import com.controleproject.service.IDepenseService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class ProxyConfig {

    @Bean
    @Primary
    public IDepenseService depenseService(@Qualifier("depenseServiceTarget") IDepenseService targetService) {
        return TransactionProxy.create(targetService);
    }
}

