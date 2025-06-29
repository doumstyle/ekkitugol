<?php

namespace App\Repository;

use App\Entity\Leagues;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Leagues>
 */
class LeaguesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Leagues::class);
    }

    public function getDefaultLeague(): ?Leagues
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.name = :val')
            ->setParameter('val', 'Bronze')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    //    /**
    //     * @return Leagues[] Returns an array of Leagues objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('l.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Leagues
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
