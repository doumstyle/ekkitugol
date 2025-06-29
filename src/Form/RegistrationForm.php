<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Validator\Constraints\PasswordStrength;

class RegistrationForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname', TextType::class, [
                'label' => 'Prénom',
                'attr' => ['placeholder' => 'Prénom'],
                'constraints' => [
                    new Length([
                        'min' => 2,
                        'max' => 30,
                        'minMessage' => "Le prénom doit contenir au moins {{ limit }} caractères",
                        'maxMessage' => "Le prénom doit contenir au plus {{ limit }} caractères"
                    ])
                ]
            ])
            ->add('lastname', TextType::class, [
                'label' => 'Nom',
                'attr' => ['placeholder' => 'Nom'],
                'constraints' => [
                    new Length([
                        'min' => 2,
                        'max' => 30,
                        'minMessage' => 'Le nom doit contenir au moins {{limit}} caractères',
                        'maxMessage' => 'Le nom doit contenir au plus {{limit}} caractères'
                    ])
                ]
            ])
            ->add('email', EmailType::class, [
                'label' => 'Email',
                'attr' => ['placeholder' => 'Email'],
            ])
            // ->add('roles')
            ->add('password', RepeatedType::class, [
                'type' => PasswordType::class,
                'required' => true,
                'first_options' => [
                    'label' => 'Votre mot de passe',
                    'attr' => ['placeholder' => '********'],
                    'constraints' => [
                        new Length([
                            'min' => 8,
                            'max' => 30,
                            'minMessage' => 'Le mot de passe doit contenir au moins {{ limit }} caractères',
                            'maxMessage' => 'Le mot de passe doit contenir au plus {{ limit }} caractères',
                        ]),
                        // new PasswordStrength([
                        //     'minScore' => PasswordStrength::STRENGTH_WEAK, // Vous pouvez ajuster le niveau requis (WEAK, MEDIUM, STRONG, VERY_STRONG)
                        //     'message' => 'Le mot de passe n\'est pas assez fort.',
                        // ])
                    ]
                ],
                'second_options' => [
                    'label' => 'Confirmer votre mot de passe',
                    'attr' => ['placeholder' => '********']
                ]
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'S\'inscrire',
                'attr' => [
                    'class' => 'btn btn-success mt-3 mx-auto w-100'
                ]
            ])

        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
