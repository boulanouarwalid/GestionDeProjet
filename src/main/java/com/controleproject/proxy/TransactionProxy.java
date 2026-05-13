package com.controleproject.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.lang.reflect.InvocationTargetException;

public class TransactionProxy implements InvocationHandler {
    private final Object target;


    public TransactionProxy(Object target) {
        this.target = target;
    }
    @SuppressWarnings("unchecked")
    public static <T> T create(T target) {
        return (T) Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                new TransactionProxy(target)
        );
    }

    @Override
    public Object invoke(Object proxy, Method m, Object[] args) throws Throwable {
        try {
            beginTransaction();
            Object result = m.invoke(target, args);
            commitTransaction();
            return result;
        } catch (InvocationTargetException e) {
            throw e.getTargetException();
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Proxy runtime access error: " + e.getMessage(), e);
        }
    }

    private void commitTransaction() {
        System.out.println("Transaction committed.");
    }

    private void beginTransaction() {
        System.out.println("Transaction started.");
    }
}
