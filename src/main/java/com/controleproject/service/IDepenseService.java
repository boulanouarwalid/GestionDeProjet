package com.controleproject.service;

import java.util.List;
import com.controleproject.dto.DepenseDTO;
import com.controleproject.entity.Depense;
import com.controleproject.observer.Observer;

public interface IDepenseService {
    List<Depense> getAllDepenses();
    Depense createDepense(DepenseDTO dto, Long tacheId);
    List<Depense> getDepenseByTache(Long tacheId);
    Depense modifyDepense(Long depenseId, DepenseDTO dto);
    void delete(Long depenseId);

    void addObserver(Observer o);
    void removeObserver(Observer o);
}
