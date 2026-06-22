package com.example.smartfinancetracker.controller;

import com.example.smartfinancetracker.model.Expense;
import com.example.smartfinancetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAllByOrderByDateDesc();
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        if (expense.getTitle() == null || expense.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (expense.getAmount() == null || expense.getAmount() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        if (expense.getCategory() == null || expense.getCategory().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (expense.getDate() == null) {
            return ResponseEntity.badRequest().build();
        }
        Expense savedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(savedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
