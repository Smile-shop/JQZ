import { Module } from 'vuex';
import { RootState } from '../index';

interface SystemState{
  a: string;
}

export const mallModule: Module<SystemState, RootState> = {
  state: () => ({
    a: '测试'
  })
};
